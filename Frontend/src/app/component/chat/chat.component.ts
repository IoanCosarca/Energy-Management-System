import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDModel } from 'src/app/model/id-response.model';
import { MessageModel } from 'src/app/model/message.model';
import { TypingModel } from 'src/app/model/typing.model';
import { UserModel } from 'src/app/model/user.model';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from 'src/app/service/user.service';

declare const Stomp: any;
declare const SockJS: any;

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	isAdmin: boolean = false;

	currentUser!: number;

	users: { name: string; selected: boolean; email: string }[] = [];

	selectedUser: { name: string; selected: boolean; email: string } = { name: "", selected: false, email: "" };

	selectedUserId: number = 0;

	url: string = 'http://localhost:8084/chatSocket';

	client: any;

	messages: any[] = [];

	databaseMessages: any[] = [];

	messageForm: FormGroup;

	newMessage: MessageModel = {
		text: '',
		date: new Date(),
		sender: 0,
		receiver: 0,
		seen: false
	};

	isTyping: boolean = false;

	typingStatus: TypingModel = {
		sender: 0,
		receiver: 0,
		typing: false
	};

	constructor(
		private userService: UserService,
		private chatService: ChatService,
		private router: Router,
		private datePipe: DatePipe,
		private formBuilder: FormBuilder
	) {
		this.messageForm = this.formBuilder.group({
			text: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		const loggedInUser = JSON.parse(sessionStorage.getItem('jwt') as string);
		this.isAdmin = loggedInUser.role === 'ADMIN';
		this.currentUser = this.isAdmin ? 0 : loggedInUser.id;
		this.isAdmin ? this.initAdminChat() : this.initUserChat();
	}

	initAdminChat(): void {
		this.fetchClientUsers();
	}

	initUserChat(): void {
		this.users = [{ name: 'Administrator', selected: false, email: '' }];
	}

	fetchClientUsers(): void {
		this.userService.getUsers().subscribe(
			(databaseUsers: UserModel[]) => {
				this.users = databaseUsers
					.filter(user => user.role === 'CLIENT')
					.map(user => ({ name: user.name, selected: false, email: user.email }));
			},
			(error) => console.error('Error fetching users', error)
		);
	}

	isMyMessage(senderId: number): boolean {
		return this.isAdmin ? senderId === 0 : senderId === this.currentUser;
	}

	connection(): void {
		let ws = new SockJS(this.url);
		this.client = Stomp.over(ws);

		this.client.connect({}, () => {
			let typingTimeout: any;

			this.client.subscribe("/topic/messages", (m: any) => {
				this.newMessage = JSON.parse(m.body);
				this.messages = this.messages.filter(message => message.text !== "typing...");
				this.newMessage.seen = false;

				if (this.isAdmin) {
					this.userService.getIDbyEmail(this.selectedUser.email).subscribe(
						(IDResponse: IDModel) => {
							if (IDResponse.id === this.newMessage.sender) {
								this.messages.push({
									text: this.newMessage.text,
									date: this.newMessage.date,
									reply: false,
									user: {
										name: this.selectedUser.name,
										avatar: '',
									},
									seen: this.newMessage.seen
								});
								this.markMessageAsSeen(this.newMessage);
							}
						},
						(error) => {
							console.error('Error fetching selected user id', error);
						}
					);
				}
				else {
					if (this.newMessage.sender !== Number(JSON.parse(sessionStorage.getItem('jwt') as string).id)) {
						this.messages.push({
							text: this.newMessage.text,
							date: this.newMessage.date,
							reply: false,
							user: {
								name: "Administrator",
								avatar: '',
							},
							seen: this.newMessage.seen
						});
						this.markMessageAsSeen(this.newMessage);
					}
				}
			});
			this.client.subscribe("/topic/typing", (t: any) => {
				this.typingStatus = JSON.parse(t.body);
				// Clear previous typingTimeout
				clearTimeout(typingTimeout);

				if (this.isAdmin && this.typingStatus.sender === this.selectedUserId) {
					// If admin receives a typing message from the selected user
					const typingMessageIndex = this.messages.findIndex(message => message.text === "typing...");
					if (this.typingStatus.typing && typingMessageIndex === -1) {
						this.messages.push({
							text: "typing...",
							reply: false,
							user: {
								name: this.selectedUser.name,
								avatar: '',
							}
						});
					}
					else if (!this.typingStatus.typing && typingMessageIndex !== -1) {
						// Remove "typing..." message
						this.messages.splice(typingMessageIndex, 1);
					}
				}
				else if (!this.isAdmin && this.typingStatus.sender === this.selectedUserId) {
					// If a user receives a typing message from the admin
					const typingMessageIndex = this.messages.findIndex(message => message.text === "typing...");
					if (this.typingStatus.typing && typingMessageIndex === -1) {
						this.messages.push({
							text: "typing...",
							reply: false,
							user: {
								name: "Administrator",
								avatar: '',
							}
						});
					}
					else if (!this.typingStatus.typing && typingMessageIndex !== -1) {
						// Remove "typing..." message
						this.messages.splice(typingMessageIndex, 1);
					}
				}
				// Start a new timeout
				typingTimeout = setTimeout(() => {
					// Stop typing after 5 seconds
					this.typingStatus.typing = false;
					this.client.send("/chatSocket-typing", {}, JSON.stringify(this.typingStatus));
				}, 5000);
			});
			this.client.subscribe("/topic/messageSeen", (seenMessage: any) => {
				this.markMessageAsSeenInUI(JSON.parse(seenMessage.body));
			});
		},
			(error: any) => {
				console.error('WebSocket connection error:', error);
			});
	}

	markMessageAsSeenInUI(seenMessage: any): void {
		const existingMessageIndex = this.messages.findIndex(
			(existingMessage: any) => {
				const textMatch = existingMessage.text === seenMessage.text;
				const isAdminMessage = existingMessage.sender === 0 || (existingMessage.sender !== this.currentUser && this.isAdmin);
				const dateMatch = new Date(existingMessage.date).getTime() === new Date(seenMessage.date).getTime();

				const senderMatch = this.isAdmin ? (
					isAdminMessage || (existingMessage.user && existingMessage.user.name === this.selectedUser.name)
				) : (
					(!isAdminMessage && existingMessage.user && existingMessage.user.email === seenMessage.senderEmail) ||
					(isAdminMessage && seenMessage.senderEmail === '') // Check for admin message
				);

				return textMatch && senderMatch && dateMatch;
			}
		);

		if (existingMessageIndex !== -1) {
			this.messages[existingMessageIndex].seen = true;
		}
		else {
			console.log('No matching unseen message found in UI.');
		}
	}

	selectUser(user: { name: string; selected: boolean; email: string }) {
		this.disconnectWebSocket();
		this.messages = [];
		this.databaseMessages = [];
		this.users.forEach(u => (u.selected = false));
		user.selected = true;
		this.selectedUser = user;

		// Fetch messages sent by the logged-in user
		this.ensureWebSocketConnection().then(() => {
			this.chatService.getMessagesBySender(this.currentUser).subscribe(
				(loggedInUserMessages: MessageModel[]) => {
					for (let message of loggedInUserMessages) {
						this.addMessage(message, this.currentUser);
					}
					if (this.isAdmin) {
						this.userService.getIDbyEmail(this.selectedUser.email).subscribe(
							(selectedUserIdResponse: IDModel) => {
								this.selectedUserId = selectedUserIdResponse.id;

								this.chatService.getMessagesBySender(this.selectedUserId).subscribe(
									(selectedUserMessages: MessageModel[]) => {
										for (let message of selectedUserMessages) {
											this.addMessage(message, this.selectedUserId);
										}
										// Filter messages for the logged-in admin
										this.userService.getIDbyEmail(this.selectedUser.email).subscribe(
											(selectedUserId: IDModel) => {
												this.databaseMessages = this.filterMessagesForAdmin(loggedInUserMessages, selectedUserMessages, selectedUserId.id);
												this.orderMessages();
												this.markMessagesAsSeen(selectedUserId.id, selectedUserMessages);
											},
											(error) => {
												console.error('Error fetching selected user id', error);
											}
										);
									},
									(error) => {
										console.error('Error fetching messages for selected user', error);
									}
								);
							},
							(error) => {
								console.error('Error fetching selected user id', error);
							}
						);
					}
					else {
						// Only add admin messages if they are not already in loggedInUserMessages
						const adminMessages = loggedInUserMessages.filter(msg => msg.sender === 0);
						for (let message of adminMessages) {
							this.addMessage(message, 0);
						}

						// Fetch admin messages
						this.chatService.getMessagesBySender(0).subscribe(
							(adminMessages: MessageModel[]) => {
								for (let message of adminMessages) {
									// Add admin messages only if they are not already present
									if (!loggedInUserMessages.some(msg => msg.text === message.text && msg.sender === 0)) {
										this.addMessage(message, 0);
									}
								}
								this.orderMessages();
								this.markMessagesAsSeen(0, adminMessages);
							},
							(error) => {
								console.error('Error fetching messages for admin', error);
							}
						);
					}
				},
				(error) => {
					console.error('Error fetching messages for logged-in user', error);
				}
			);
		});
	}

	ensureWebSocketConnection(): Promise<void> {
		return new Promise<void>((resolve) => {
			// Check if the connection is already established
			if (this.client && this.client.connected) {
				resolve();
			}
			else {
				// Otherwise, establish the connection
				this.connection();
				// Set a timeout to check the connection status
				const checkConnection = () => {
					if (this.client && this.client.connected) {
						resolve();
					}
					else {
						// Retry after a short delay
						setTimeout(checkConnection, 100);
					}
				};
				checkConnection();
			}
		});
	}

	filterMessagesForAdmin(loggedInUserMessages: MessageModel[], selectedUserMessages: MessageModel[], selectedUserId: number): MessageModel[] {
		// Combine messages based on the selected user for the logged-in admin
		return loggedInUserMessages.filter(message => message.receiver === selectedUserId)
			.concat(selectedUserMessages);
	}

	addMessage(message: MessageModel, sender: number): void {
		this.databaseMessages.push({
			...message,
			sender,
		});
	}

	markMessageAsSeen(messageAddedToUI: MessageModel): void {
		try {
			messageAddedToUI.seen = true;
			this.client.send("/chatSocket-messageSeen", {}, JSON.stringify(messageAddedToUI));
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}

	markMessagesAsSeen(_senderId: number, messagesAddedToUI: MessageModel[]): void {
		// Iterate through each message and mark it as seen
		this.databaseMessages.forEach((message: any) => {
			if (!message.seen && messagesAddedToUI.some(msg => this.isSameMessage(msg, message))) {
				// Send each message status update to the backend through WebSocket
				const messageToUpdate = {
					text: message.text,
					date: new Date(message.date).toISOString(),
					sender: message.sender,
					receiver: message.receiver,  // Include the receiver information
					seen: true,
				};

				try {
					this.client.send("/chatSocket-messageSeen", {}, JSON.stringify(messageToUpdate));
				} catch (error) {
					console.error('Error sending message:', error);
				}
			}
		});
	}

	isSameMessage(msg1: MessageModel, msg2: MessageModel): boolean {
		return msg1.text === msg2.text && msg1.sender === msg2.sender;
	}

	orderMessages(): void {
		this.databaseMessages.sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();

			return dateA - dateB;
		});
		this.databaseMessages.forEach(message => {
			message.date = this.datePipe.transform(message.date, 'medium');
		});
		this.initializeMessages();
	}

	initializeMessages(): void {
		this.messages = this.databaseMessages.map(message => {
			const isMyMessage = this.isMyMessage(message.sender);
			const senderName = isMyMessage ? 'You' : this.getUserDisplayName();

			return {
				text: message.text,
				date: new Date(message.date).toISOString(), // Format date consistently
				reply: isMyMessage,
				user: {
					name: senderName,
					avatar: '',
				},
				seen: message.seen,
			};
		});
	}

	getUserDisplayName(): string {
		return this.isAdmin ? this.selectedUser.name : 'Administrator';
	}

	sendMessage(event?: Event): void {
		if (!event || (event instanceof KeyboardEvent && event.key === 'Enter')) {
			if (this.messageForm.valid) {
				this.newMessage.text = this.messageForm.get('text')?.value;
				this.newMessage.date = new Date(this.datePipe.transform(new Date(), 'MMM dd, yyyy, hh:mm:ss a')!);

				if (this.isAdmin === false) {
					this.newMessage.sender = JSON.parse(sessionStorage.getItem('jwt') as string).id;
					this.newMessage.receiver = 0;
					this.processMessage();
				}
				else {
					this.newMessage.sender = 0;
					this.userService.getIDbyEmail(this.selectedUser.email).subscribe(
						(IDResponse: IDModel) => {
							this.newMessage.receiver = IDResponse.id;
							this.processMessage();
						},
						(error) => {
							console.error('Error fetching user', error);
						}
					);
				}
			}
		}
	}

	processMessage() {
		this.messages.push({
			text: this.newMessage.text,
			date: this.newMessage.date,
			reply: true,
			user: {
				name: 'You',
				avatar: '',
			},
			seen: false
		});

		this.client.send("/chatSocket-message", {}, JSON.stringify(this.newMessage));
		this.newMessage.text = '';
		this.messageForm.reset();
	}

	onTyping(event: KeyboardEvent): void {
		if (event.key !== 'Enter') {
			this.typingStatus.typing = true;

			if (this.isAdmin) {
				this.typingStatus.sender = 0;
				this.typingStatus.receiver = this.selectedUserId;
				this.client.send("/chatSocket-typing", {}, JSON.stringify(this.typingStatus));
			}
			else {
				this.typingStatus.sender = JSON.parse(sessionStorage.getItem('jwt') as string).id;
				this.typingStatus.receiver = 0;
				this.client.send("/chatSocket-typing", {}, JSON.stringify(this.typingStatus));
			}
		}
	}

	disconnectWebSocket(): void {
		if (this.client && this.client.connected) {
			this.client.disconnect(() => { });
		}
		this.client = null;
	}

	goBack(): void {
		this.disconnectWebSocket();
		this.router.navigate(['/Home']);
	}
}
