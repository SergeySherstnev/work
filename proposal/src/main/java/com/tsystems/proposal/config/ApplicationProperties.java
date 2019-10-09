package com.tsystems.proposal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Arrays;
import java.util.List;

/**
 * Properties specific to Proposal.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
    private final Ldap ldap = new Ldap();

    public Ldap getLdap() { return ldap; }


    public static class Ldap {
        private String url = "ldap://10.233.104.38:389/dc=t-systems,dc=ru";
        private String managerDn = "T-SYSTEMS\\mad-svc-rdp";
        private String managerPassword = "kp$vQz9t";
        //private String userSearchBase = "ou=Users_SPb";
        private String userSearchBase = "";
        //private String userSearchFilter = "(sAMAccountName={0})";
        private String userSearchFilter = "(&(sAMAccountName={0})(&((objectClass=user)(mail=*))))";
        private List<String> admins = Arrays.asList(new String[]{"asatarov"});
        private List<String> managers = Arrays.asList(new String[]{"msanjako", "emuras", "alkovale", "advinyan"});

        public List<String> getAdmins() {
            return admins;
        }

        public void setAdmins(List<String> admins) {
            this.admins = admins;
        }

        public List<String> getManagers() {
            return managers;
        }

        public void setManagers(List<String> managers) {
            this.managers = managers;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getManagerDn() {
            return managerDn;
        }

        public void setManagerDn(String managerDn) {
            this.managerDn = managerDn;
        }

        public String getManagerPassword() {
            return managerPassword;
        }

        public void setManagerPassword(String managerPassword) {
            this.managerPassword = managerPassword;
        }

        public String getUserSearchBase() {
            return userSearchBase;
        }

        public void setUserSearchBase(String userSearchBase) {
            this.userSearchBase = userSearchBase;
        }

        public String getUserSearchFilter() {
            return userSearchFilter;
        }

        public void setUserSearchFilter(String userSearchFilter) {
            this.userSearchFilter = userSearchFilter;
        }
    }
}
