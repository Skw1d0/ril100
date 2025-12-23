# Ril100

## Was ist Ril100

**Wichtig:**
**_Ril100 ist eine private Webanwendung! Die bereitgestellten APN-Pläne sind keine signaltechischen Lagepläne und dürfen nicht zu betriebliche Zwecke benutzt werden._**

Die Ril100 ist eine Richtlinie der Deutschen Bahn. Sie beinhaltet ein Verzeichnis der Abkürzungen der Betriebsstellen der DB InfraGO AG. Siehe dazu die [Abkürzungen der Betriebsstellen](https://www.dbinfrago.com/web/schienennetz/betrieb/allgemeine-betriebsinformationen/betriebsstellen-12592996).

## Was bietet die App?

In der Anwendung bietet:

- Suche von Betriebsstellen gemäß Betriebsstellenname, DS100 oder Streckennummer
- Suche nach Streckenkillomentrierung bei Eingabe der Streckennummer (gem. API Openrailwaymaps)
- Angrenzende Betriebsstellen werden mit Killomenterangabe und Streckennumer angezeigt
- Downloadfunktion von APN-Plänen (falls vorhanden)
- Anzeige von OpenStreetMaps i.V.m. Openrailwaymaps der ausgewählten Betriebsstelle
- Weiterleitung zu Google Maps der ausgewählten Betriebsstelle

## Wie erreiche ich die App

Die Ril100-App kann unter [https://skw1d0.github.io/ril100](https://skw1d0.github.io/ril100) aufgerufen werden.

## Bezug der Daten

Die Anwendung basiert auf den Daten des [Trassenfinder](https://trassenfinder.de/) der DB InfraGO AG. Die API des Trassenfinder bietet die Möglichkeit, Infrastrukturen nach Fahrplanjahr zu beziehen. Dazu sind zwei Schritte nötig:

1. Die ID des Fahrplanjahres herausfinden: [https://openapi.trassenfinder.de/api/v9/infrastrukturen](https://openapi.trassenfinder.de/api/v9/infrastrukturen)
2. Die Daten der gewünschten ID abrufen: https://openapi.trassenfinder.de/api/v9/infrastrukturen/{infrastrukturId}

Eine Dokumentation kann unter [https://openapi.trassenfinder.de/openapi](https://openapi.trassenfinder.de/openapi) aufgerufen werden.
