package io.gatling.demo

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class SoloUrl extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://48.209.10.166:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .originHeader("http://48.209.10.166:8080")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0")
  
  private val headers_0 = Map(
  		"Access-Control-Request-Headers" -> "authorization",
  		"Access-Control-Request-Method" -> "GET",
  		"Priority" -> "u=4"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "application/json, text/plain, */*",
  		"If-None-Match" -> """W/"2e-DPvInVNQOAR2kSF0Qmbt1Axpuv8"""",
  		"authorization" -> "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4MGNlNDY3MzQyNGYxM2JkZTZjYWUyOCIsInVzZXJuYW1lIjoiTWl0b2Nhbm5ubm4iLCJlbWFpbCI6Im1pdG9jYW5ubm5AZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkQWF3RTJrU09rOGhlR2pTbkxmSk5SZUh5WFQ5WmNMbEdtM1ppL3g4T1BGZDVickp5dkIuZkMiLCJjb250ZXN0cyI6W10sImNyZWF0ZWRBdCI6IjIwMjUtMDQtMjZUMTM6NDk6MjcuMDU3WiIsIl9fdiI6MH0sImlhdCI6MTc0NTY3NTM2NywiZXhwIjoxNzQ1Njc4OTY3fQ.SX49QixU_focckEDNgneROGXvSEqrqJlaLtJaQ7N6ss"
  )


  private val scn = scenario("SoloUrl")
    .exec(
      http("request_0")
        .options("/profile")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get("/profile")
            .headers(headers_1)
        )
    )

	setUp(scn.inject(atOnceUsers(1))).protocols(httpProtocol)
}
