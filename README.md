# Varaus API

Yksinkertainen REST API huonevarausten hallintaan.  
API mahdollistaa huoneen varaamisen, varausten listaamisen ja varausten poistamisen.  
Tietokantana käytetään SQLitea.

API pyörii oletuksena osoitteessa: http://localhost:3000/

## Käynnistys

Asenna riippuvuudet

```
npm install
```

Käynnistä palvelin

```
npm start
```

Terveystarkistus

URL: http://localhost:3000/

Vastaus:

Reservation API is running

## API päätepisteet

### GET /reservations

Listaa kaikki varaukset.

Method: GET

URL:

```
http://localhost:3000/reservations
```

Vastausesimerkki:

```
[
  {
    "id": 1,
    "room_id": 1,
    "user_name": "Matti Meikäläinen",
    "start_time": "2026-03-20T10:00:00.000Z",
    "end_time": "2026-03-20T11:00:00.000Z"
  }
]
```

### POST /reservations

Lisää varauksen.

Method: POST

Headers: Content-Type: application/json

URL:

```
http://localhost:3000/reservations
```
Body (raw /JSON)

```
{
  "room_id": 1,
  "user_name": "Matti Meikäläinen",
  "start_time": "2026-03-20T10:00:00.000Z",
  "end_time": "2026-03-20T11:00:00.000Z"
}
```

Onnistunut vastaus (201):

```
{
  "id": 1,
  "room_id": 1,
  "user_name": "Matti Meikäläinen",
  "start_time": "2026-03-20T10:00:00.000Z",
  "end_time": "2026-03-20T11:00:00.000Z"
}
```

Virhe päällekkäisestä varauksesta (409):

```
{
  "error": "Room already reserved for this time period"
}
```

### DELETE /reservations/:id

Poistaa varauksen id:n perusteella.

Method: DELETE

URL:

```
http://localhost:3000/reservations/1
```
Onnistunut vastaus:

```
{
  "message": "Reservation deleted"
}
```

Virhe (404):

```
{
  "error": "Reservation not found"
}
```

### GET /reservations/room/:roomId

Listaa varaukset huoneen mukaan.

Method: GET

URL:

```
http://localhost:3000/reservations/room/1
```

Onnistunut vastaus:

```
[
  {
    "id": 1,
    "room_id": 1,
    "user_name": "Matti Meikäläinen",
    "start_time": "2026-03-20T10:00:00.000Z",
    "end_time": "2026-03-20T11:00:00.000Z"
  }
]
```

### GET /reservations/exampledata

Lisää esimerkkidataa tietokantaa testauksen helpottamiseksi.

Method: GET

URL

```
http://localhost:3000/reservations/exampledata
```

Onnistunut vastaus:

```
{"message":"Example reservation data inserted","count":10}
```
