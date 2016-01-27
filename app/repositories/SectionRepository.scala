package repositories

import com.amazonaws.services.dynamodbv2.document.Item
import model.Section
import play.api.Logger
import services.Dynamo
import scala.collection.JavaConversions._
import java.util.concurrent.atomic.AtomicReference


object SectionRepository {
  def getSection(id: Long) = {
    Option(Dynamo.sectionTable.getItem("id", id)).map(Section.fromItem)
  }

  def updateSection(section: Section) = {
    try {
      Dynamo.sectionTable.putItem(section.toItem)
      Some(section)
    } catch {
      case e: Error => None
    }
  }

  def loadAllSections = Dynamo.sectionTable.scan().map(Section.fromItem)

  def count = Dynamo.sectionTable.scan().count(_ => true)

}

object SectionLookupCache {

  // a map makes this faster to lookup
  private val m = Map[Long,Section]()
  val allSections = new AtomicReference[Map[Long, Section]](m)

  def refresh = {
    val sections = SectionRepository.loadAllSections
    sections.foreach { section =>
      insertSection(section)
    }
  }

  def getSection(id: Option[Long]): Option[Section] = {
    id.flatMap { i =>
      allSections.get.get(i)
    }
  }

  def insertSection(section: Section): Unit = {
    val currentSections = allSections.get
    val newSections = currentSections + (section.id -> section)

    if(!allSections.compareAndSet(currentSections, newSections)) {
      Logger.warn("failed to update section cache")
    }

  }

  def removeSection(id: Long): Unit = {
    val currentSections = allSections.get
    val newSections = currentSections - id

    if(!allSections.compareAndSet(currentSections, newSections)) {
      Logger.warn("failed to update section cache")
    }
  }
}
