package model.command

import model.command.logic.TagPathCalculator
import repositories.PathManager


class PathUsageCheck(`type`: String, slug: String, sectionId: Option[Long]) extends Command {

  type T = Map[String, Boolean]

  override def process()(implicit username: Option[String] = None): Option[Map[String, Boolean]] = {
    val calculatedPath = TagPathCalculator calculatePath(`type`, slug, sectionId)

    val inUse = PathManager isPathInUse(calculatedPath)

    Some(Map("inUse" -> inUse))
  }
}
