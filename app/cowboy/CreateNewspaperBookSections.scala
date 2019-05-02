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
  println("Creating Observer Design NBS")

  // Observer design
  Await.result(CreateNewspaperBookSection(
    internalName = "Obs: Design Magazine (nbs)",
    externalName = "Observer Design",
    slug = "design",
    preCalculatedPath = "theobserver/design/design",

    parentNewspaperBook = 85423,
    section = 196,
    capiSectionId = Some("lifeandstyle")
  ).process, 10.seconds)

  println("--------------------------------------------------------------")
  println("--------------------------------------------------------------")
}
