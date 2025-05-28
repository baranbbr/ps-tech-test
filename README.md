# Account Achievements Aggregator Task

## Required info to calculate account achievement level:

-   Get all users (need IDs).
-   Get games owned for each userId.
-   Calculate per game achievement %.
-   Iterate over games played and calculate achievement %
-   Per game, get available achievements from adjacent game object, get total completed achievements from root

### Achievement levels

Bronze = owns > 10 games
Silver = owns >= 10 games + 75% achivements in each
Gold = owns >= 25 games + 80% achievements in each
Platinum = owns >= 50 games + 100% achievements in each

## Random Ideas

1. Pagination/lazy loading on the API to improve performance
2. Walking around game with three.js, some kind of coin collecting game in a house?
