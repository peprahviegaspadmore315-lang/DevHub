package com.learningplatform.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ProductionDatabasePropertiesResolverTest {

    @Test
    void resolvesExplicitJdbcDatabaseSettings() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DB_URL", "jdbc:postgresql://db.example.com:5432/devhub")
                .withProperty("DB_USERNAME", "app_user")
                .withProperty("DB_PASSWORD", "secret");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals("jdbc:postgresql://db.example.com:5432/devhub", properties.jdbcUrl());
        assertEquals("app_user", properties.username());
        assertEquals("secret", properties.password());
    }

    @Test
    void convertsDatabaseUrlToJdbcUrl() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgres://render-user:render-pass@db.example.com:5432/devhub?sslmode=require");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals("jdbc:postgresql://db.example.com:5432/devhub?sslmode=require", properties.jdbcUrl());
        assertEquals("render-user", properties.username());
        assertEquals("render-pass", properties.password());
    }

    @Test
    void addsSupabaseSslModeWhenMissing() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DB_URL", "jdbc:postgresql://db.project.supabase.co:5432/postgres")
                .withProperty("DB_USERNAME", "postgres")
                .withProperty("DB_PASSWORD", "secret");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals("jdbc:postgresql://db.project.supabase.co:5432/postgres?sslmode=require", properties.jdbcUrl());
    }

    @Test
    void addsSupabaseTransactionPoolerCompatibilityFlags() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DATABASE_URL", "postgres://postgres.project:secret@aws-0-eu-west-1.pooler.supabase.com:6543/postgres");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals(
                "jdbc:postgresql://aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0&preferQueryMode=simple",
                properties.jdbcUrl()
        );
        assertEquals("postgres.project", properties.username());
        assertEquals("secret", properties.password());
    }

    @Test
    void convertsExplicitPostgresStyleDbUrlToJdbcUrl() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DB_URL", "postgres://app-user:app-pass@db.example.com:5432/devhub");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals("jdbc:postgresql://db.example.com:5432/devhub", properties.jdbcUrl());
        assertEquals("app-user", properties.username());
        assertEquals("app-pass", properties.password());
    }

    @Test
    void buildsJdbcUrlFromPgEnvironmentVariables() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("PGHOST", "db.internal")
                .withProperty("PGPORT", "6543")
                .withProperty("PGDATABASE", "devhub")
                .withProperty("PGUSER", "render")
                .withProperty("PGPASSWORD", "pass")
                .withProperty("PGSSLMODE", "require");

        ProductionDatabaseProperties properties = ProductionDatabasePropertiesResolver.resolve(environment);

        assertEquals("jdbc:postgresql://db.internal:6543/devhub?sslmode=require", properties.jdbcUrl());
        assertEquals("render", properties.username());
        assertEquals("pass", properties.password());
    }

    @Test
    void throwsHelpfulErrorWhenNoProductionDatabaseSettingsExist() {
        IllegalStateException error = assertThrows(
                IllegalStateException.class,
                () -> ProductionDatabasePropertiesResolver.resolve(new MockEnvironment())
        );

        assertEquals(
                "Missing production database configuration. Set DB_URL, JDBC_DATABASE_URL, DATABASE_URL, or PGHOST/PGDATABASE.",
                error.getMessage()
        );
    }
}
