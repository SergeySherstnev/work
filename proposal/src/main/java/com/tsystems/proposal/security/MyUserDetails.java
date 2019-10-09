package com.tsystems.proposal.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class MyUserDetails extends User {

    private final Long dbUserId;

    public MyUserDetails(String username, String password,
                Collection<? extends GrantedAuthority> authorities, Long dbUserId) {
        super(username, password, authorities);
        this.dbUserId = dbUserId;
    }

    public Long getDbUserId() {
        return dbUserId;
    }

}
