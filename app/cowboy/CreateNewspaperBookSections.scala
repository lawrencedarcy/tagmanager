package cowboy

import scala.concurrent._
import scala.concurrent.duration._

import services.Config
import model.command.CreateNewspaperBookSection

object CreateNewspaperBookSections extends App {

  // Initialize config
  Config()

  implicit val username: Option[String] = Some("Sam Cutler")

  println("--------------------------------------------------------------")
  println("--------------------------------------------------------------")
  println("Creating week in review")

  Await.result(CreateNewspaperBookSection(
    internalName = "(DO NOT USE) Gdn: Week in Review (nbs)",
    externalName = "Week in Review",
    slug = "week-in-review",
    preCalculatedPath = "theguardian/mainsection/week-in-review",

    parentNewspaperBook = 16600,
    section = 205,
    capiSectionId = Some("theguardian")
  ).process, 10.seconds)

  println("--------------------------------------------------------------")
  println("--------------------------------------------------------------")
}
