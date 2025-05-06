import { prisma } from "../client";

interface TransmissionType {
	id: number;
	name: string;
}

export const transmissionTypeApi = {
	getAll: async (): Promise<TransmissionType[]> => {
		try {
			const transmissionTypes = await prisma.transmissionType.findMany({
				select: {
					id: true,
					name: true,
				},
				orderBy: { name: "asc" }
			});
			return transmissionTypes;
		} catch (error) {
			console.error("Vites tipleri alınırken hata oluştu:", error);
			throw error;
		}
	}
};