package com.learningplatform.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MailSettingsResolverTest {

    @Test
    void collapsesWhitespaceInGoogleStyleAppPasswords() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("MAIL_USERNAME", "peprahviegaspadmore315@gmail.com")
                .withProperty("MAIL_FROM", "peprahviegaspadmore315@gmail.com")
                .withProperty("MAIL_PASSWORD", "nbhw nnuz qcrx jvfc");

        MailSettingsResolver resolver = new MailSettingsResolver(environment);

        assertTrue(resolver.isMailConfigured());
        assertEquals("nbhwnnuzqcrxjvfc", resolver.resolvePassword());
    }

    @Test
    void preservesNormalPasswordsThatContainMeaningfulCharacters() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("MAIL_PASSWORD", "my-smtp password");

        MailSettingsResolver resolver = new MailSettingsResolver(environment);

        assertEquals("my-smtp password", resolver.resolvePassword());
    }
}
