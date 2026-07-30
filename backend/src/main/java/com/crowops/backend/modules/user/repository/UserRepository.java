package com.crowops.backend.modules.user.repository;

import com.crowops.backend.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    /**
     * Returns all non-deleted users, paginated.
     */
    Page<User> findAllByDeletedAtIsNull(Pageable pageable);

    /**
     * Finds a non-deleted user by ID.
     */
    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Full-text search across username, email, firstName and lastName
     * for non-deleted users, paginated.
     */
    @Query("""
            SELECT u FROM User u
            WHERE u.deletedAt IS NULL
            AND (
                LOWER(u.username)  LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(u.email)     LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(u.lastName)  LIKE LOWER(CONCAT('%', :query, '%'))
            )
            """)
    Page<User> searchActiveUsers(@Param("query") String query, Pageable pageable);
}