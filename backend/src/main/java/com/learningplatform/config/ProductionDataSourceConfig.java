package com.learningplatform.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
@Slf4j
public class ProductionDataSourceConfig {

    @Bean
    @Primary
    public DataSource productionDataSource(Environment environment) {
        ProductionDatabaseProperties databaseProperties = ProductionDatabasePropertiesResolver.resolve(environment);

        HikariDataSource dataSource = DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .driverClassName("org.postgresql.Driver")
                .url(databaseProperties.jdbcUrl())
                .build();

        if (StringUtils.hasText(databaseProperties.username())) {
            dataSource.setUsername(databaseProperties.username());
        }

        if (StringUtils.hasText(databaseProperties.password())) {
            dataSource.setPassword(databaseProperties.password());
        }

        log.info("Configured production datasource from {}", databaseProperties.source());
        if (databaseProperties.jdbcUrl().contains(".pooler.supabase.com:6543")) {
            log.warn("Detected Supabase transaction pooler URL. Session mode on port 5432 is still preferred for long-lived Spring services.");
        }
        return dataSource;
    }
}
