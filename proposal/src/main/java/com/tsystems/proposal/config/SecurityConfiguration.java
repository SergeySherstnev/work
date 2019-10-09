package com.tsystems.proposal.config;

import com.tsystems.proposal.security.*;
import com.tsystems.proposal.security.jwt.*;

import io.github.jhipster.config.JHipsterConstants;
import org.elasticsearch.common.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

import javax.naming.Context;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final TokenProvider tokenProvider;
    private final CorsFilter corsFilter;
    private final SecurityProblemSupport problemSupport;

    private final Logger log = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Autowired
    private MyAuthoritiesPopulator myAuthPopulator;

    @Autowired
    private MyUserDetailsContextMapper myUserDetailsContextMapper;

    @Autowired
    private Environment env;

    ApplicationProperties.Ldap properties;

    public SecurityConfiguration(TokenProvider tokenProvider, CorsFilter corsFilter, SecurityProblemSupport problemSupport, ApplicationProperties appProperties) {
        this.tokenProvider = tokenProvider;
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
        this.properties = appProperties.getLdap();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        log.info("Active profiles: {}", env.getActiveProfiles().toString());
        if (! env.acceptsProfiles(Profiles.of(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT))) {
            log.info("Configure LDAP for non DEV profiles.");
            auth.ldapAuthentication()
                .contextSource()
                .url(properties.getUrl())
                .managerDn(properties.getManagerDn())
                .managerPassword(properties.getManagerPassword())
                .and()
                .userSearchBase(properties.getUserSearchBase())
                .userSearchFilter(properties.getUserSearchFilter())
                .ldapAuthoritiesPopulator(myAuthPopulator)
                .userDetailsContextMapper(myUserDetailsContextMapper);
        } else {
            log.info("Use DB users for DEV profiles.");
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/h2-console/**")
            .antMatchers("/swagger-ui/index.html")
            .antMatchers("/test/**");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
            .disable()
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling()
            .authenticationEntryPoint(problemSupport)
            .accessDeniedHandler(problemSupport)
        .and()
            .headers()
            .contentSecurityPolicy("default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:")
        .and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
        .and()
            .featurePolicy("geolocation 'none'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; speaker 'none'; fullscreen 'self'; payment 'none'")
        .and()
            .frameOptions()
            .deny()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/api/register").permitAll()
            .antMatchers("/api/activate").permitAll()
            .antMatchers("/api/account/reset-password/init").permitAll()
            .antMatchers("/api/account/reset-password/finish").permitAll()
            // random quote should be shown on footer for all users
            .antMatchers("/api/quotes/random").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/websocket/tracker").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/websocket/**").permitAll()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/info").permitAll()
            .antMatchers("/management/prometheus").permitAll()
            .antMatchers("/management/**").permitAll() //hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .httpBasic()
        .and()
            .apply(securityConfigurerAdapter());
        // @formatter:on
    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider);
    }
}
