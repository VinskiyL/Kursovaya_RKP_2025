package ru.kafpin.config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ru.kafpin.pojos.ReadersCatalog;
import java.util.Collection;
import java.util.Collections;

@RequiredArgsConstructor
public class ReadersCatalogDetails implements UserDetails {

    private final ReadersCatalog reader;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = reader.getAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return reader.getPassword();
    }

    @Override
    public String getUsername() {
        return reader.getLogin();
    }

    @Override
    public boolean isEnabled() {
        return reader.getIsActive();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }
}