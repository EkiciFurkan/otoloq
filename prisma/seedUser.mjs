// /seed.mjs
// veya /prisma/seed.mjs

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Prisma Client'ı başlat
const prisma = new PrismaClient();

// Hash'leme için salt round sayısı
const saltRounds = 10;

async function main() {
	console.log(`Start seeding ...`);

	// Örnek kullanıcı bilgileri
	const userEmail = 'test@example.com';
	const userPassword = 'password123'; // Bu şifre hash'lenecek

	// Şifreyi hash'le
	const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
	console.log(`Password "${userPassword}" hashed to: ${hashedPassword}`);

	// Kullanıcıyı oluştur veya güncelle (upsert)
	// upsert kullanmak, script birden fazla kez çalıştırıldığında
	// "Unique constraint failed" hatasını önler.
	const user = await prisma.user.upsert({
		where: { email: userEmail }, // Kullanıcıyı e-posta ile bul
		update: {
			// Eğer kullanıcı zaten varsa, şifresini ve adını güncelle (isteğe bağlı)
			password: hashedPassword,
			name: 'Test Kullanıcısı (Güncellendi)',
			// emailVerified: new Date(), // Eğer e-posta doğrulama alanı varsa
		},
		create: {
			// Eğer kullanıcı yoksa, yeni kullanıcı oluştur
			email: userEmail,
			name: 'Test Kullanıcısı',
			password: hashedPassword,
			// emailVerified: new Date(), // Eğer e-posta doğrulama alanı varsa
			// Diğer gerekli alanları buraya ekleyebilirsiniz
		},
	});

	console.log(`Created or updated user with ID: ${user.id} and email: ${user.email}`);

	// Buraya başka modeller için de seed verileri ekleyebilirsiniz
	// Örneğin:
	// const post = await prisma.post.create({
	//   data: {
	//     title: 'İlk Yazım',
	//     content: 'Bu benim Prisma ile oluşturduğum ilk yazı!',
	//     authorId: user.id, // Eğer User ile Post arasında bir ilişki varsa
	//   },
	// });
	// console.log(`Created post with ID: ${post.id}`);

	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		// Başarılı olursa Prisma Client bağlantısını kapat
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		// Hata olursa hatayı yazdır ve Prisma Client bağlantısını kapat
		console.error('Error during seeding:', e);
		await prisma.$disconnect();
		process.exit(1); // Hata koduyla çık
	});
