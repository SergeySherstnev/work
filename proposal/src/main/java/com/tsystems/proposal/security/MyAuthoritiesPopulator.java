package com.tsystems.proposal.security;

import com.tsystems.proposal.config.ApplicationProperties;
import com.tsystems.proposal.domain.Authority;
import com.tsystems.proposal.domain.User;
import com.tsystems.proposal.service.UserService;
import com.tsystems.proposal.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service("authPopulator")
public class MyAuthoritiesPopulator implements LdapAuthoritiesPopulator {
    static final Logger log = LoggerFactory.getLogger(MyAuthoritiesPopulator.class);

    private final UserService userService;
    private final ApplicationProperties.Ldap properties;

    public MyAuthoritiesPopulator(ApplicationProperties appProperties, UserService userService) {
        this.properties = appProperties.getLdap();
        this.userService = userService;
    }

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData, String username) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        User loggedUser = null;
        try{
            Optional<User> user = userService.getUserWithAuthoritiesByLogin(username);
            if (user.isPresent()) {
                loggedUser = user.get();
            } else {
                log.info("Logged user is not in DB. Create new one." );
                // User is logged by Ldap but not exists in DB: create user
                loggedUser = userService.createUser(createUserFromLdap(userData));
            }
        } catch(Exception e) {
            log.error("Threw exception in MyAuthoritiesPopulator::getGrantedAuthorities : " + e.getMessage(), e);
        }

        if (loggedUser != null) {
            for (Authority userRole : loggedUser.getAuthorities()) {
                authorities.add(new SimpleGrantedAuthority(userRole.getName()));
            }
        }
        return authorities;
    }

    private UserDTO createUserFromLdap(DirContextOperations userData) {
        UserDTO result = new UserDTO();
        result.setFirstName(userData.getStringAttribute("givenName"));
        result.setLastName(userData.getStringAttribute("sn"));
        result.setLogin(userData.getStringAttribute("sAMAccountName"));
        result.setEmail(userData.getStringAttribute("mail"));

        String department = userData.getStringAttribute("department");
        Set<String> auths = new HashSet<>();
        if (department != null && department.startsWith("Tel-IT BSO")) {
            // add user role
            auths.add(AuthoritiesConstants.USER);
        } else {
            // add guest role
            auths.add(AuthoritiesConstants.GUEST);
        }

        // add ADMIN role for predefined admin user
        if (properties.getAdmins().contains(result.getLogin())) {
            auths.add(AuthoritiesConstants.ADMIN);
            log.info("ADMIN role added for user " + result.getLogin());
        }

        // add MANAGER role for predefined admin user
        if (properties.getManagers().contains(result.getLogin())) {
            auths.add(AuthoritiesConstants.MANAGER);
            log.info("MANAGER role added for user " + result.getLogin());
        }

        result.setAuthorities(auths);
        log.info("User to create : " + result.toString());
        return result;
    }
}
