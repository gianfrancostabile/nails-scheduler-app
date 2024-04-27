import WhitelistRepository from "../repository/WhitelistRepository";

async function findAll(): Promise<string[]> {
  return await WhitelistRepository.findAll();
}

const WhitelistService = {
  findAll,
};

export default WhitelistService;
