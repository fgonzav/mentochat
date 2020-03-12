package cl.globant.controller;


import cl.globant.ChatService;
import cl.globant.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller("/mentochat")
public class ChatController {

    @Autowired
    private ChatService service;

    @MessageMapping("/connect")
    @SendTo("/topic/chat")
    public Message connect(Message message){
        return new Message(service.connect(message.getName()), message.getName(), "connected");
    }

    @MessageMapping("/handle")
    @SendTo("/topic/chat")
    public Message handle(Message message){
        return new Message(message.getId(), service.getName(message.getId()), message.getContent());
    }
}
