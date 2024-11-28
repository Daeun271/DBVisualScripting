package com.daeun.dbvisualscripting.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.context.annotation.Import;

import com.daeun.dbvisualscripting.server.auth.UserEntity;
import com.daeun.dbvisualscripting.server.auth.UserRepository;
import com.daeun.dbvisualscripting.server.config.TestDataSourceConfig;

@SpringBootTest
@Import(TestDataSourceConfig.class)
class ServerApplicationTests {
	@Autowired
    private UserRepository userRepository;

    @Test
    public void test() {
        UserEntity user = new UserEntity();
        user.setUsername("test");
        user.setEmail("test@test.com");
        user.setPassword("test1234!");
        this.userRepository.save(user);

        UserEntity savedUser = this.userRepository.findByEmail("test@test.com").get();
        assert savedUser.getUsername().equals("test");
        assert savedUser.getEmail().equals("test@test.com");
        assert savedUser.getPassword().equals("test1234!");
    }
}
