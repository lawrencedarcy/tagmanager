package model

import org.cvogt.play.json.Jsonx
import com.gu.tagmanagement.{PaidContentInformation => ThriftPaidContentInformation}

case class PaidContentInformation(paidContentType: String, campaignColour: Option[String] = None) {

  def asThrift = ThriftPaidContentInformation(
    paidContentType = paidContentType,
    campaignColour = campaignColour
  )

  def asExportedXml = {
    <paidContentType>{this.paidContentType}</paidContentType>
    <campaignColour>{this.campaignColour.getOrElse("")}</campaignColour>
  }
}

object PaidContentInformation {

  implicit val paidContentInformationFormat = Jsonx.formatCaseClass[PaidContentInformation]

  def apply(thriftPaidContentInformation: ThriftPaidContentInformation): PaidContentInformation =
    PaidContentInformation(
      paidContentType = thriftPaidContentInformation.paidContentType,
      campaignColour = thriftPaidContentInformation.campaignColour
    )
}
