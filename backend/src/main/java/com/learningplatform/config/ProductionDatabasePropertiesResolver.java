package com.learningplatform.config;

import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

final class ProductionDatabasePropertiesResolver {

    private ProductionDatabasePropertiesResolver() {
    }

    static ProductionDatabaseProperties resolve(Environment environment) {
        String explicitUsername = trimToNull(environment.getProperty("DB_USERNAME"));
        String explicitPassword = trimToNull(environment.getProperty("DB_PASSWORD"));

        ParsedDatabaseUrl explicitUrl = parseDatabaseUrl(
                firstNonBlank(
                        environment.getProperty("DB_URL"),
                        environment.getProperty("JDBC_DATABASE_URL")
                ),
                "DB_URL/JDBC_DATABASE_URL"
        );
        if (explicitUrl != null) {
            return new ProductionDatabaseProperties(
                    applyManagedPostgresCompatibility(explicitUrl.jdbcUrl(), explicitUrl.host(), explicitUrl.port()),
                    firstNonBlank(explicitUsername, explicitUrl.username()),
                    firstNonBlank(explicitPassword, explicitUrl.password()),
                    explicitUrl.source()
            );
        }

        ParsedDatabaseUrl databaseUrl = parseDatabaseUrl(environment.getProperty("DATABASE_URL"), "DATABASE_URL");
        if (databaseUrl != null) {
            return new ProductionDatabaseProperties(
                    applyManagedPostgresCompatibility(databaseUrl.jdbcUrl(), databaseUrl.host(), databaseUrl.port()),
                    firstNonBlank(explicitUsername, databaseUrl.username()),
                    firstNonBlank(explicitPassword, databaseUrl.password()),
                    databaseUrl.source()
            );
        }

        String pgHost = trimToNull(environment.getProperty("PGHOST"));
        String pgDatabase = trimToNull(environment.getProperty("PGDATABASE"));
        if (pgHost != null && pgDatabase != null) {
            String pgPort = firstNonBlank(trimToNull(environment.getProperty("PGPORT")), "5432");
            String sslMode = trimToNull(environment.getProperty("PGSSLMODE"));

            StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                    .append(formatHost(pgHost))
                    .append(":")
                    .append(pgPort)
                    .append("/")
                    .append(pgDatabase);

            if (sslMode != null) {
                jdbcUrl.append("?sslmode=").append(sslMode);
            }

            return new ProductionDatabaseProperties(
                    applyManagedPostgresCompatibility(jdbcUrl.toString(), pgHost, parsePort(pgPort)),
                    firstNonBlank(explicitUsername, trimToNull(environment.getProperty("PGUSER"))),
                    firstNonBlank(explicitPassword, trimToNull(environment.getProperty("PGPASSWORD"))),
                    "PGHOST/PGDATABASE"
            );
        }

        throw new IllegalStateException(
                "Missing production database configuration. Set DB_URL, JDBC_DATABASE_URL, DATABASE_URL, or PGHOST/PGDATABASE."
        );
    }

    private static ParsedDatabaseUrl parseDatabaseUrl(String candidate, String source) {
        String value = trimToNull(candidate);
        if (value == null) {
            return null;
        }

        if (value.startsWith("jdbc:postgresql://")) {
            URI jdbcUri = URI.create(value.substring("jdbc:".length()));
            return new ParsedDatabaseUrl(value, null, null, source, trimToNull(jdbcUri.getHost()), jdbcUri.getPort());
        }

        if (value.startsWith("postgres://") || value.startsWith("postgresql://")) {
            URI uri = URI.create(value);
            String host = trimToNull(uri.getHost());
            String path = trimToNull(uri.getRawPath());

            if (host == null || path == null || "/".equals(path)) {
                throw new IllegalStateException("Invalid PostgreSQL connection string: " + value);
            }

            StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                    .append(formatHost(host));

            if (uri.getPort() > 0) {
                jdbcUrl.append(":").append(uri.getPort());
            }

            jdbcUrl.append(path);

            String query = trimToNull(uri.getRawQuery());
            if (query != null) {
                jdbcUrl.append("?").append(query);
            }

            String username = null;
            String password = null;
            String userInfo = trimToNull(uri.getRawUserInfo());
            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                username = decode(parts[0]);
                if (parts.length > 1) {
                    password = decode(parts[1]);
                }
            }

            return new ParsedDatabaseUrl(jdbcUrl.toString(), username, password, source, host, uri.getPort());
        }

        return new ParsedDatabaseUrl(value, null, null, source, null, -1);
    }

    private static String applyManagedPostgresCompatibility(String jdbcUrl, String host, int port) {
        String normalizedHost = trimToNull(host);
        if (normalizedHost == null) {
            return jdbcUrl;
        }

        String resolvedUrl = jdbcUrl;
        if (isSupabaseHost(normalizedHost) && !hasQueryParameter(resolvedUrl, "sslmode")) {
            resolvedUrl = appendQueryParameter(resolvedUrl, "sslmode", "require");
        }

        if (isSupabaseTransactionPooler(normalizedHost, port)) {
            if (!hasQueryParameter(resolvedUrl, "prepareThreshold")) {
                resolvedUrl = appendQueryParameter(resolvedUrl, "prepareThreshold", "0");
            }

            if (!hasQueryParameter(resolvedUrl, "preferQueryMode")) {
                resolvedUrl = appendQueryParameter(resolvedUrl, "preferQueryMode", "simple");
            }
        }

        return resolvedUrl;
    }

    private static boolean isSupabaseHost(String host) {
        String normalizedHost = host.toLowerCase(Locale.ROOT);
        return normalizedHost.endsWith(".supabase.co") || normalizedHost.endsWith(".supabase.com");
    }

    private static boolean isSupabaseTransactionPooler(String host, int port) {
        return host.toLowerCase(Locale.ROOT).endsWith(".pooler.supabase.com") && port == 6543;
    }

    private static boolean hasQueryParameter(String jdbcUrl, String parameterName) {
        int queryStart = jdbcUrl.indexOf('?');
        if (queryStart < 0 || queryStart == jdbcUrl.length() - 1) {
            return false;
        }

        String query = jdbcUrl.substring(queryStart + 1);
        for (String part : query.split("&")) {
            String key = part;
            int equalsIndex = part.indexOf('=');
            if (equalsIndex >= 0) {
                key = part.substring(0, equalsIndex);
            }

            if (parameterName.equalsIgnoreCase(key)) {
                return true;
            }
        }

        return false;
    }

    private static String appendQueryParameter(String jdbcUrl, String parameterName, String parameterValue) {
        String delimiter = jdbcUrl.contains("?") ? "&" : "?";
        return jdbcUrl + delimiter + parameterName + "=" + parameterValue;
    }

    private static int parsePort(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ignored) {
            return -1;
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            String trimmed = trimToNull(value);
            if (trimmed != null) {
                return trimmed;
            }
        }
        return null;
    }

    private static String formatHost(String host) {
        if (host.contains(":") && !host.startsWith("[")) {
            return "[" + host + "]";
        }
        return host;
    }

    private record ParsedDatabaseUrl(
            String jdbcUrl,
            String username,
            String password,
            String source,
            String host,
            int port
    ) {
    }
}
