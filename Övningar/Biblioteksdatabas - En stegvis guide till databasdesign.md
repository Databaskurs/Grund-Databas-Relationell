# **Biblioteksdatabas \- En stegvis guide till databasdesign**

## **Introduktion**

Ett bibliotek behöver hålla reda på:

* Böcker (som verk/titlar \- t.ex. "Sagan om Ringen")  
* Fysiska exemplar (specifika kopior \- t.ex. "Exemplar \#A123 av Sagan om Ringen")  
* Författare  
* Utlåning  
* Låntagare

## **Utgångsläge: Denormaliserad Data**

Vi har en stor tabell med följande kolumner:

LIBRARY\_DATA  
\- BookID  
\- Title  
\- ISBN  
\- Genre  
\- CopyID  
\- CopyCondition  
\- CopyStatus  
\- AcquisitionDate  
\- Author  
\- AuthorBirthDate  
\- AuthorCountry  
\- LoanID  
\- BorrowerName  
\- BorrowerEmail  
\- BorrowerPhone  
\- LoanDate  
\- ReturnDate

## **Steg 1: Grundläggande Normalisering**

I detta steg ska du:

1. Placera kolumnerna i rätt tabell  
2. Markera bara Primary Keys \[PK\]  
3. INTE tänka på andra constraints eller kopplingar än

BOOKS (information om själva verket/titeln)  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK? \_\_\_\]  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

BOOK\_COPIES (information om fysiska exemplar)  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK? \_\_\_\]  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

AUTHORS  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK? \_\_\_\]  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ 

BORROWERS  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK? \_\_\_\]  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ 

LOANS  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK? \_\_\_\]  
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   
□ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

*Tips för Steg 1:*

* BOOKS innehåller information som är samma för alla exemplar av samma bok  
* BOOK\_COPIES innehåller information som är unik för varje fysiskt exemplar  
* Exempel:  
  * "Harry Potter och De Vises Sten" är EN post i BOOKS  
  * Biblioteket kan ha 5 exemplar av boken \= 5 poster i BOOK\_COPIES  
  * När någon lånar boken, lånar de ett specifikt exemplar

## **Steg 2: Constraints**

Nu ska vi lägga till regler för varje kolumn:

* NN \= Not Null (måste ha ett värde)  
* U \= Unique (måste vara unikt)

Ta din lösning från Steg 1 och lägg till dessa markeringar:

BOOKS  
\- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[PK, NN/U? \_\_\_\_\_\_\_\_\]  
\- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[NN/U? \_\_\_\_\_\_\_\_\]  
\- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[NN/U? \_\_\_\_\_\_\_\_\]  
\- \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \[NN/U? \_\_\_\_\_\_\_\_\]

(... fortsätter för alla tabeller)

*Tips för Steg 2:*

* Kan ett exemplar sakna status?  
* Måste varje bok ha en titel?  
* Kan två olika böcker ha samma ISBN?  
* Måste vi veta när ett exemplar införskaffades?

## **Steg 3: Relationer och Foreign Keys**

Nu ska vi koppla ihop tabellerna. För varje tabell:

1. Identifiera vilka andra tabeller den behöver kopplas till  
2. Lägg till Foreign Keys (FK)  
3. Markera FKs med \[FK, NN\] i din lösning

*Tänk på:*

* Ett exemplar tillhör en specifik bok  
* En bok kan ha en eller flera författare  
* Ett lån gäller ett specifikt exemplar  
* Ett lån är kopplat till en låntagare

## **Steg 4: JOINS**

Nu ska vi använda vår struktur\! Skriv queries för att:

1. Lista alla tillgängliga exemplar av "Sagan om Ringen":  
   * Vilka tabeller behöver du?  
   * Hur kopplar du ihop dem?  
   * Hur filtrerar du på tillgängliga exemplar?  
2. Visa alla aktiva lån med:  
   * Låntagarens namn  
   * Bokens titel  
   * Exemplar-ID  
   * Lånedatum  
3. Lista alla böcker av svenska författare med:  
   * Antal tillgängliga exemplar  
   * Totalt antal exemplar  
   * Senaste lånedatum

## **Steg 5: Cascading Actions**

Nu ska vi fundera på vad som händer när vi tar bort eller uppdaterar data.

För varje Foreign Key, bestäm lämplig cascade-regel:

* ON DELETE CASCADE  
* ON DELETE SET NULL  
* ON DELETE RESTRICT  
* ON UPDATE CASCADE

Exempel:

BOOK\_COPIES  
\- CopyID \[PK\]  
\- BookID \[FK, NN\] REFERENCES Books ON DELETE \_\_\_\_\_\_\_ ON UPDATE \_\_\_\_\_\_\_

*Diskussionsfrågor:*

1. Om vi tar bort en bok:  
   * Vad ska hända med dess exemplar?  
   * Vad ska hända med lån av dessa exemplar?  
2. Om vi tar bort en låntagare:  
   * Ska vi behålla lånehistoriken?  
   * Om ja, hur markerar vi att låntagaren är borttagen?  
3. Om vi uppdaterar ett CopyID:  
   * Ska det uppdateras automatiskt i LOANS-tabellen?  
   * Vilka risker finns med detta?

