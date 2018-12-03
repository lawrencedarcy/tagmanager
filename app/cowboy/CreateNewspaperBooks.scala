package cowboy
import services.Config
import model.command.CreateNewspaperBook
import scala.concurrent._
import scala.concurrent.duration._

object CreateNewspaperBooks extends App {

  // Initialize config
  Config()

  // User for auditing (which doesnt seem to work for some reason lmao)
  implicit val username: Option[String] = Some("Sam Cutler")

  // Create newspaper books
  //Await.result(
  //  CreateNewspaperBook(
  //    internalName = "(DO NOT USE) Gdn: Journal G1 (nb)",
  //    externalName = "Journal",
  //    slug = "journal",
  //    preCalculatedPath = "theguardian/journal",

  //    publication = 2,
  //    section = 205,
  //    capiSectionId = "theguardian"
  //  ).process, 10.seconds)

  //Await.result(
  //  CreateNewspaperBook(
  //    internalName = "(DO NOT USE) Gdn: Feast (nb)",
  //    externalName = "Feast",
  //    slug = "feast",
  //    preCalculatedPath = "theguardian/feast",

  //    publication = 2,
  //    section = 196,
  //    capiSectionId = "lifeandstyle"
  //  ).process, 10.seconds)

}
