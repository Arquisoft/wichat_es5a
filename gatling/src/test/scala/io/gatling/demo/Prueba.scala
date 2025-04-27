package io.gatling.demo

import scala.concurrent.duration._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class Prueba extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0")

  private val headers_0 = Map(
    "Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "If-None-Match" -> """W/"6dc-562ft5j1127S0SQ/OAcB4zYwFwY"""",
    "Priority" -> "u=0, i",
    "Upgrade-Insecure-Requests" -> "1"
  )

  private val headers_1 = Map("If-None-Match" -> """W/"7a5a64-Mhb1v/kK1BesWE/ko9Z2TbOtTys"""")
  private val headers_2 = Map(
    "Access-Control-Request-Headers" -> "content-type",
    "Access-Control-Request-Method" -> "POST",
    "Origin" -> "http://localhost:8080",
    "Priority" -> "u=4"
  )
  private val headers_3 = Map(
    "Accept" -> "application/json, text/plain, */*",
    "Content-Type" -> "application/json",
    "Origin" -> "http://localhost:8080",
    "Priority" -> "u=0"
  )
  private val headers_5 = Map(
    "Accept" -> "application/json, text/plain, */*",
    "Content-Type" -> "application/json",
    "Origin" -> "http://localhost:8080"
  )

  val feeder = Iterator.continually {
    val data = Map(
      "username" -> ("Usuario" + scala.util.Random.alphanumeric.take(7).mkString),
      "password" -> ("Password" + scala.util.Random.nextInt(1000000).toString),
      "email"    -> ("usuario" + scala.util.Random.nextInt(1000000).toString + "@example.com")
    )
    println(s"Generated data: $data")
    data
  }

  private val uri1 = "localhost"

  private val scn = scenario("Prueba")
    .feed(feeder)
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":8080/adduser")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":8080/static/js/bundle.js")
            .headers(headers_1)
        ),
      pause(22),
      http("request_2")
        .options("/adduser")
        .headers(headers_2)
    )
    .exec(
      http("request_3")
        .post("/adduser")
        .headers(headers_3)
        .body(StringBody(session => {
          val username = session("username").as[String]
          val email = session("email").as[String]
          val password = session("password").as[String]
          s"""{
            "username": "$username",
            "email": "$email",
            "password": "$password",
            "confirmPassword": "$password"
          }"""
        })).asJson
    )
    .pause(10) // <-- Aquí el nuevo pause después de crear el usuario
    .exec(
      http("request_4")
        .options("/login")
        .headers(headers_2)
    )
    .exec(
      http("request_5")
        .post("/login")
        .headers(headers_5)
        .body(StringBody(session => {
          val username = session("username").as[String]
          val password = session("password").as[String]
          s"""{
            "username": "$username",
            "password": "$password"
          }"""
        })).asJson
    )
    .pause(12)
    .exec(
      http("request_6")
        .options("/questions/flag")
        .headers(headers_2)
        .resources(
          http("request_7")
            .options("/questions/flag")
            .headers(headers_2),
          http("request_8")
            .post("/questions/flag")
            .headers(headers_5)
            .body(RawFileBody("io/gatling/demo/prueba/0008_request.json")),
          http("request_9")
            .post("/questions/flag")
            .headers(headers_5)
            .body(RawFileBody("io/gatling/demo/prueba/0009_request.json"))
        )
    )
    .pause(13)
    .exec(
      http("request_10")
        .options("/savegame")
        .headers(headers_2)
        .resources(
          http("request_11")
            .post("/savegame")
            .headers(headers_3)
            .body(RawFileBody("io/gatling/demo/prueba/0011_request.json"))
        )
    )
    .pause(13)
    .exec(
      http("request_12")
        .options("/login")
        .headers(headers_2)
        .resources(
          http("request_13")
            .post("/login")
            .headers(headers_3)
            .body(StringBody(session => {
              val username = session("username").as[String]
              val password = session("password").as[String]
              s"""{
                "username": "$username",
                "password": "$password"
              }"""
            })).asJson
        )
    )

  setUp(scn.inject(atOnceUsers(10))).protocols(httpProtocol)
}