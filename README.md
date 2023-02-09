# Introduction

This is a personal showcase project - I'm trying to build a backend from Node.js and Express for an imagined currency exchange.

The code is probably not optimized, and probably a bit messy - that's because this is a work in progress, and I prefer to not abstract and clean things up before I know what exactly will be required.

The imaginary currency exchange has no opinion on which currency should cost how much. Users can post their offers, containing which currency they're buying, in which currency they're paying, and how much are they willing to pay for each unit. For example:
```
Users Ben (buyer) and Susie (seller) have both 10 EUR and 10 USD

Susie posts an offer {buy: EUR, sell: USD, limitPrice: 2, amount: 5}
    Which means, that she's interested in buying 5 Euros, and she's willing to pay 2 Dollars for each euro, for a total of 10 USD.

Ben takes a part of this offer - he will sell 3 Euros, for which he'll get 6 Dollars.

In the end, Ben has 7 EUR and 16 USD, Susie has 13 EUR and 4 USD, and the offer still stands - should anyone want to sell the remaining 2 EUR
```

Now also supports automatic settlement for new standing orders up to your limit price.

# Installation
Install `yarn` and `node` (e.g. `node v16`), then run
```
yarn
cp .env.example .env
```
Create a SQL database, and have it running.

Then modify `.env` with the specific SQL database's connection string and token secrets. You can put in any string, but if you want to do it properly, generate some long (64+ chars), random hexadecimal string.

Finally, run database migrations with 
```
yarn migrate:latest
```

## Run
```
yarn dev
```
Then you can send requests with postman, or similar tools! (Swagger UI on roadmap).

# Roadmap
### Features
- Market orders: Fulfill my order with existing standing orders, until I buy desired amount

### Tech
- SwaggerUI documentation
- Database population scripts, and tests
- Docker build

# Why do it like this?
I am trying to practice my best practices (har har), so I try to follow a few principles

## Encapsulate the services
I want to separate each framework (express, knex) to its own encapsulated functions which don't depend on each other. I want to be able to reuse knex functions for something, that doesn't use express variables like `req` and `res`, in case we have to update / change the providers. Or we might want to go to GraphQL. 

## Legible code
Code should be self-explanatory and should read as its own documentation. Comments should explain why, not how. If you need a comment to explain "how", it's probably too complicated

## Immutable variables
You will find very few `let` and no `var` here - rewriting variables, and globals are a bad idea and should be avoided whenever possible. They are a the right solution sometimes, but outside of puzzle/academic programming that's very rare.

## Good logging
Logs are for free, so might as well use them. But be careful to not store sensitive data there!

## Assume everything will go wrong
Related to good logging. What if the server will crash when executing this task? Be prepared for fails in the most inconvenient places - middle of database inserts, disconnects right after sending requests, users being impatient and demolishing that "submit" button...

## DRY, but be smart about it
Don't Repeat Yourself is well accepted principle, but it can (rarely) be a bad thing. Digging through 17 nested classes / functions / variables is no one's favorite pastime, so it can happen that duplicating some part of code can be beneficial - especially when dealing with small types.

## Don't abstract hastily
Just as copy-paste wastes time when maintaining, a bad abstraction might waste just as much. Only abstract when you know what will be needed, and feel free to copy-paste to better understand the problem.

## Minimum dependencies
Only use those dependencies you need - you can do the rest yourself. You probably don't need that `isPromise` one-liner library. Ever heard of dependency attacks?
