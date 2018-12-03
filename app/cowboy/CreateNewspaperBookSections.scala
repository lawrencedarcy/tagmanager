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
  println("Creating G2 Film and G2 Music")

  // FILM
  Await.result(CreateNewspaperBookSection(
    internalName = "Gdn: G2 Film (nbs)",
    externalName = "Film",
    slug = "film",
    preCalculatedPath = "theguardian/g2/film",

    parentNewspaperBook = 16593,
    section = 188,
    capiSectionId = Some("film") // TODO
  ).process, 10.seconds)

  // MUSIC - DONE
  Await.result(CreateNewspaperBookSection(
    internalName = "Gdn: G2 Music (nbs)",
    externalName = "Music",
    slug = "music",
    preCalculatedPath = "theguardian/g2/music",

    parentNewspaperBook = 16593,
    section = 201,
    capiSectionId = Some("music")
  ).process, 10.seconds)

  println("--------------------------------------------------------------")
  println("--------------------------------------------------------------")
}
