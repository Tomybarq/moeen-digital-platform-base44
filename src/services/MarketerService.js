/**
 * Marketer Domain Service — Mo'een Digital Platform
 */
import Base44Adapter from "@/adapters/Base44Adapter";
import BaseService from "@/services/baseService";

const marketerAdapter = Base44Adapter.marketer;

class MarketerServiceClass extends BaseService {
  constructor() {
    super(marketerAdapter, "المسوّق");
  }

  async toggleArchive(id, currentStatus) {
    const next = currentStatus === "archived" ? "active" : "archived";
    return this.update(id, { status: next });
  }
}

const MarketerService = new MarketerServiceClass();
export default MarketerService;