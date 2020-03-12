package cl.globant.config;

import cl.globant.ChatService;
import cl.globant.MessageType;
import cl.globant.domain.Message;
import cl.globant.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.Collection;

@Configuration
@EnableScheduling
public class ScheduleConfig {

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private ChatService service;

    @Scheduled(fixedRate = 60000)
    public void disconnectExpiredUsers(){
        Collection<User> connectedUsers = service.getConnectedUsers();
        connectedUsers.forEach(u -> {
            if(u.getLastMessage().isBefore(LocalDateTime.now().minusMinutes(3))){
                template.convertAndSend("/topic/chat", new Message(u.getId(), u.getName(), "disconnected due to inactivity", MessageType.DISCONNECT));
                service.disconnect(u.getId());
            }
        });
    }
}
