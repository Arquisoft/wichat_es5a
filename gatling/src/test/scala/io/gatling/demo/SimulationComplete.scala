package io.gatling.demo

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class SimulationComplete extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://48.209.10.166:8000")
    .inferHtmlResources()
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  		"If-None-Match" -> """W/"6dc-562ft5j1127S0SQ/OAcB4zYwFwY"""",
  		"Priority" -> "u=0, i",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "*/*",
  		"If-None-Match" -> """W/"7a5a64-Mhb1v/kK1BesWE/ko9Z2TbOtTys""""
  )
  
  private val headers_2 = Map(
  		"Accept" -> "*/*",
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Origin" -> "http://48.209.10.166:8080",
  		"Priority" -> "u=4"
  )
  
  private val headers_3 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://48.209.10.166:8080",
  		"Priority" -> "u=0"
  )
  
  private val headers_5 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://48.209.10.166:8080"
  )
  
  private val headers_14 = Map("Origin" -> "http://48.209.10.166:8080")
  

  val feeder = Iterator.continually {
    val data = Map(
      "username" -> ("Usuario" + scala.util.Random.alphanumeric.take(7).mkString),
      "password" -> ("Password" + scala.util.Random.nextInt(1000000).toString),
      "email"    -> ("usuario" + scala.util.Random.nextInt(1000000).toString + "@example.com")
    )
    data
  }

  private val uri1 = "48.209.10.166"

  private val scn = scenario("Prueba")
    .feed(feeder)
    .exec(
      http("Cargar página de registro")
        .get("http://" + uri1 + ":8080/adduser")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("http://" + uri1 + ":8080/static/js/bundle.js")
            .headers(headers_1)
        ),
      pause(22),
      http("Preflight OPTIONS /adduser")
        .options("/adduser")
        .headers(headers_2)
    )
    .exec(
      http("AddUser")
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
    .pause(10) 
    .exec(
      http("Cargar Login")
        .options("/login")
        .headers(headers_2)
    )
    .exec(
      http("Login")
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
      http("Cargar Juego")
        .options("/questions/flag")
        .headers(headers_2)
        .resources(
          http("Segunda carga del juego")
            .options("/questions/flag")
            .headers(headers_2),
          http("Enviar opciones del juego")
            .post("/questions/flag")
            .headers(headers_5)
            .body(RawFileBody("io/gatling/demo/simulationcomplete/0008_request.json")),
          http("Más opciones del juego")
            .post("/questions/flag")
            .headers(headers_5)
            .body(RawFileBody("io/gatling/demo/simulationcomplete/0009_request.json"))
        )
    )
    .pause(2)
    .exec(
      http("Cargar LLM")
        .options("/askllm")
        .headers(headers_2)
        .resources(
          http("Respuesta LLM")
            .post("/askllm")
            .headers(headers_3)
            .body(RawFileBody("io/gatling/demo/simulationcomplete/0011_request.json"))
        )
    )
    .pause(21)
    .exec(
      http("Cargar guardado del juego")
        .options("/savegame")
        .headers(headers_2)
        .resources(
          http("Enviar datos del guardado")
            .post("/savegame")
            .headers(headers_3)
            .body(RawFileBody("io/gatling/demo/simulationcomplete/0013_request.json"))
        )
    )
    .pause(7)
    .exec(
      http("Cargar historial")
        .get("/gethistory")
        .headers(headers_14)
        .resources(
          http("Obtener historial")
            .get("/gethistory")
            .headers(headers_14)
        )
    )

	setUp(scn.inject(constantUsersPerSec(10).during(60.seconds))).protocols(httpProtocol)
}
