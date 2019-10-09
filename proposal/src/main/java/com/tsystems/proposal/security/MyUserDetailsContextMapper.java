package com.tsystems.proposal.security;

import com.tsystems.proposal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service("userDetailsContextMapper")
public class MyUserDetailsContextMapper implements UserDetailsContextMapper {

    private final UserDetailsService userDetailsService;

    public MyUserDetailsContextMapper(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
        UserDetails ud = userDetailsService.loadUserByUsername(username);
        return ud;
    }

    @Override
    public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {

    }
}
