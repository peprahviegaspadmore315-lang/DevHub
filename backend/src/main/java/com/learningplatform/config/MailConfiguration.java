package com.learningplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfiguration {

    @Bean
    public JavaMailSender javaMailSender(MailSettingsResolver mailSettingsResolver) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailSettingsResolver.resolveHost());
        mailSender.setPort(mailSettingsResolver.resolvePort());

        String username = mailSettingsResolver.resolveUsername();
        String password = mailSettingsResolver.resolvePassword();

        if (username != null) {
            mailSender.setUsername(username);
        }

        if (password != null) {
            mailSender.setPassword(password);
        }

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.connectiontimeout", String.valueOf(mailSettingsResolver.resolveConnectionTimeoutMs()));
        properties.put("mail.smtp.timeout", String.valueOf(mailSettingsResolver.resolveReadTimeoutMs()));
        properties.put("mail.smtp.writetimeout", String.valueOf(mailSettingsResolver.resolveWriteTimeoutMs()));

        return mailSender;
    }
}
