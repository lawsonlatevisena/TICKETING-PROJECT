package com.justice.ticketing.dto;

import java.time.LocalDateTime;

public class HistoriqueResponse {
    private Long id;
    private String action;
    private String ancienneValeur;
    private String nouvelleValeur;
    private String commentaire;
    private LocalDateTime dateAction;
    private String utilisateurNom;
    private String utilisateurPrenom;
    
    // Constructors
    public HistoriqueResponse() {
    }
    
    public HistoriqueResponse(Long id, String action, String ancienneValeur, String nouvelleValeur, 
                             String commentaire, LocalDateTime dateAction, String utilisateurNom, String utilisateurPrenom) {
        this.id = id;
        this.action = action;
        this.ancienneValeur = ancienneValeur;
        this.nouvelleValeur = nouvelleValeur;
        this.commentaire = commentaire;
        this.dateAction = dateAction;
        this.utilisateurNom = utilisateurNom;
        this.utilisateurPrenom = utilisateurPrenom;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getAncienneValeur() {
        return ancienneValeur;
    }
    
    public void setAncienneValeur(String ancienneValeur) {
        this.ancienneValeur = ancienneValeur;
    }
    
    public String getNouvelleValeur() {
        return nouvelleValeur;
    }
    
    public void setNouvelleValeur(String nouvelleValeur) {
        this.nouvelleValeur = nouvelleValeur;
    }
    
    public String getCommentaire() {
        return commentaire;
    }
    
    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
    
    public LocalDateTime getDateAction() {
        return dateAction;
    }
    
    public void setDateAction(LocalDateTime dateAction) {
        this.dateAction = dateAction;
    }
    
    public String getUtilisateurNom() {
        return utilisateurNom;
    }
    
    public void setUtilisateurNom(String utilisateurNom) {
        this.utilisateurNom = utilisateurNom;
    }
    
    public String getUtilisateurPrenom() {
        return utilisateurPrenom;
    }
    
    public void setUtilisateurPrenom(String utilisateurPrenom) {
        this.utilisateurPrenom = utilisateurPrenom;
    }
}
