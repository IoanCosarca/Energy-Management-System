package com.utcn.chatmicroservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "messages")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private Date date;
    private Long sender;
    private Long receiver;
    private Boolean seen;

    public Message(String text, Date date, Long sender, Long receiver, Boolean seen)
    {
        this.text = text;
        this.date = date;
        this.sender = sender;
        this.receiver = receiver;
        this.seen = seen;
    }
}
