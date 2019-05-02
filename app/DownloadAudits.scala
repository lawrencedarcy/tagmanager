import model.TagAudit
import play.api.libs.json.Json
import services.Dynamo

import scala.collection.JavaConversions._

object DownloadAudits extends App {
    val json = Json.toJson(Dynamo.tagAuditTable.scan().map(TagAudit.fromItem).toList
      .filter { audit =>
          audit.tagSummary.`type`.toLowerCase == "contributor"
      })

  val t = json.toString()

  import java.io.PrintWriter

  val out = new PrintWriter("/Users/sam/projects/scratch/contributor-audits/all-contributor-audits.json")
  try {
    out.print(t)
  } finally {
    out.close()
  }
}
