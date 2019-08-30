package model.forms

import play.api.libs.json._
import enumeratum._
import enumeratum.EnumEntry.{ Uncapitalised}

sealed trait FilterTypes extends EnumEntry with Uncapitalised

object FilterTypes extends Enum[FilterTypes] {
  override val values = findValues

  case object Path extends FilterTypes
  case object InternalName extends FilterTypes
  case object ExternalName extends FilterTypes
  case object Type extends FilterTypes
}

case class SpreadSheetFilter(`type`: FilterTypes, value: String)

case class GetSpreadSheet(filters: List[SpreadSheetFilter])

object GetSpreadSheet {
  implicit val filterTypesRead: Reads[FilterTypes ] = new Reads[FilterTypes ] {
    def reads(json: JsValue): JsResult[FilterTypes] = Reads.StringReads.reads(json).flatMap {
      case "path" => JsSuccess(FilterTypes.Path)
      case "internalName" => JsSuccess(FilterTypes.InternalName)
      case "externalName" => JsSuccess(FilterTypes.ExternalName)
      case "type" => JsSuccess(FilterTypes.Type)
      case unknown: String => JsError(s"Invalid ad blocking level: $unknown")
    }
  }

  implicit val filterFormat = Json.reads[SpreadSheetFilter]
  implicit val format = Json.reads[GetSpreadSheet]
}
