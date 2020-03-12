package cl.globant;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private static final Map<UUID, String> contectedUsers = new ConcurrentHashMap<>();

    public UUID connect(String name){
        UUID id = UUID.randomUUID();
        contectedUsers.put(id, name);
        return id;
    }

    public String getName(UUID id){

        if(!contectedUsers.containsKey(id))
            throw new UserNotConnectedException();

        return contectedUsers.get(id);
    }
}
