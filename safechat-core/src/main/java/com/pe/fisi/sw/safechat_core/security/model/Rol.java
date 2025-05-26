package com.pe.fisi.sw.safechat_core.security.model;

import com.pe.fisi.sw.safechat_core.security.utils.RolEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_rol")
    private Integer idRol;
    @Column(name="nombre",nullable = false)
    @Enumerated(EnumType.STRING)
    private RolEnum rolEnum;
}