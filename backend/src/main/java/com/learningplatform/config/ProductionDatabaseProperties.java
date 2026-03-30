package com.learningplatform.config;

record ProductionDatabaseProperties(
        String jdbcUrl,
        String username,
        String password,
        String source
) {
}
