package com.utcn.chatmicroservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypingResponse {
    private Long sender;
    private Long receiver;
    private Boolean typing;
}
