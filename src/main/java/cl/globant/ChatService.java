package cl.globant;

import cl.globant.domain.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private static final Map<UUID, User> contectedUsers = new ConcurrentHashMap<>();

    public UUID connect(String name){
        UUID id = UUID.randomUUID();
        contectedUsers.put(id, new User(id, name, LocalDateTime.now()));
        return id;
    }

    public void disconnect(UUID id){
        contectedUsers.remove(id);
    }

    public void updateLastMessage(UUID id){
        contectedUsers.get(id).setLastMessage(LocalDateTime.now());
    }

    public String getName(UUID id){

        if(!contectedUsers.containsKey(id))
            throw new UserNotConnectedException();

        return contectedUsers.get(id).getName();
    }

    public Collection<User> getConnectedUsers(){
        return contectedUsers.values();
    }
}
