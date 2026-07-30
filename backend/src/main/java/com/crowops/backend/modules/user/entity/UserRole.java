package com.crowops.backend.modules.user.entity;

/**
 * Defines the roles available to users within the system.
 * ADMIN — full access to user management and all ERP features.
 * USER  — standard access limited to self-management operations.
 */
public enum UserRole {
    ADMIN,
    USER
}
