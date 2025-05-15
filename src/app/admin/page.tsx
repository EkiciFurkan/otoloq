// src/app/admin/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import "../../components/VehicleSelector/styles/StepperContainer.css";

interface Offer {
	id: number;
	vehicleType: { name: string };
	year: { year: number };
	brand: { name: string };
	model: { name: string };
	subModel: { name: string };
	bodyType: { name: string };
	fuelType: { name: string };
	transmissionType: { name: string };
	color: { name: string };
	mileage: number;
	damageRecord: string;
	damageAmount: number | null;
	contact: {
		id: number;
		fullName: string;
		phone: string;
		email: string | null;
	};
	notes: string | null;
	images: string[];
	status: string;
	adminNotes: string | null;
	offerAmount: number | null;
	createdAt: string;
	updatedAt: string;
}

export default function AdminPage() {
	const [offers, setOffers] = useState<Offer[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	// Teklif güncelleme için state'ler
	const [adminNotes, setAdminNotes] = useState("");
	const [offerStatus, setOfferStatus] = useState("PENDING");
	const [offerAmount, setOfferAmount] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState<string | null>(null);
	const [updateSuccess, setUpdateSuccess] = useState(false);

	useEffect(() => {
		const fetchOffers = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/offers");

				if (!response.ok) {
					throw new Error(`HTTP hata! Status: ${response.status}`);
				}

				const result = await response.json();
				setOffers(result.data);
				setError(null);
			} catch (err: any) {
				console.error("Teklifler alınırken hata oluştu:", err);
				setError("Teklifler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
				setOffers([]);
			} finally {
				setLoading(false);
			}
		};

		fetchOffers();
	}, []);

	// Seçilen teklif değiştiğinde form alanlarını güncelle
	useEffect(() => {
		if (selectedOffer) {
			setAdminNotes(selectedOffer.adminNotes || "");
			setOfferStatus(selectedOffer.status);
			setOfferAmount(selectedOffer.offerAmount ? selectedOffer.offerAmount.toString() : "");
			setUpdateError(null);
			setUpdateSuccess(false);
		}
	}, [selectedOffer]);

	const handleSelectOffer = (offer: Offer) => {
		setSelectedOffer(offer);
	};

	const handleCloseDetails = () => {
		setSelectedOffer(null);
	};

	// Teklif güncelleme işlemi
	const handleUpdateOffer = async () => {
		if (!selectedOffer) return;

		setIsUpdating(true);
		setUpdateError(null);
		setUpdateSuccess(false);

		try {
			const updateData = {
				status: offerStatus,
				adminNotes: adminNotes,
				offerAmount: offerAmount
			};

			const response = await fetch(`/api/offers/${selectedOffer.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Teklif güncellenirken bir hata oluştu");
			}

			// Güncellenmiş teklifi set et
			setSelectedOffer(result.data);

			// Listedeki teklifi de güncelle
			setOffers(prevOffers =>
				prevOffers.map(offer =>
					offer.id === selectedOffer.id ? result.data : offer
				)
			);

			setUpdateSuccess(true);

			// Birkaç saniye sonra başarı mesajını gizle
			setTimeout(() => {
				setUpdateSuccess(false);
			}, 3000);
		} catch (error: any) {
			console.error("Teklif güncellenirken hata:", error);
			setUpdateError(error.message || "Teklif güncellenirken bir hata oluştu");
		} finally {
			setIsUpdating(false);
		}
	};

	const getStatusClass = (status: string) => {
		switch (status) {
			case "PENDING": return "status-pending";
			case "CONTACTED": return "status-contacted";
			case "OFFERED": return "status-offered";
			case "ACCEPTED": return "status-accepted";
			case "REJECTED": return "status-rejected";
			case "COMPLETED": return "status-completed";
			default: return "";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "PENDING": return "Beklemede";
			case "CONTACTED": return "İletişime Geçildi";
			case "OFFERED": return "Teklif Verildi";
			case "ACCEPTED": return "Kabul Edildi";
			case "REJECTED": return "Reddedildi";
			case "COMPLETED": return "Tamamlandı";
			default: return status;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("tr-TR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}).format(date);
	};

	// Filtreleme işlemi
	const filteredOffers = offers.filter(offer => {
		// Status Filter
		if (statusFilter !== "all" && offer.status !== statusFilter) {
			return false;
		}

		// Search Query
		if (searchQuery) {
			const searchLower = searchQuery.toLowerCase();
			return (
				offer.contact.fullName.toLowerCase().includes(searchLower) ||
				offer.contact.phone.includes(searchQuery) ||
				(offer.contact.email && offer.contact.email.toLowerCase().includes(searchLower)) ||
				offer.brand.name.toLowerCase().includes(searchLower) ||
				offer.model.name.toLowerCase().includes(searchLower) ||
				offer.vehicleType.name.toLowerCase().includes(searchLower)
			);
		}

		return true;
	});

	if (loading) {
		return <div className="admin-loading">Teklifler yükleniyor...</div>;
	}

	if (error) {
		return <div className="admin-error">{error}</div>;
	}

	return (
		<div className="admin-container">
			<header className="admin-header">
				<h1>Teklif Yönetim Paneli</h1>
				<div className="admin-filters">
					<div className="search-container">
						<input
							type="text"
							placeholder="Ara... (İsim, Telefon, Marka, Model)"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
					</div>
					<div className="status-filter">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="status-select"
						>
							<option value="all">Tüm Durumlar</option>
							<option value="PENDING">Beklemede</option>
							<option value="CONTACTED">İletişime Geçildi</option>
							<option value="OFFERED">Teklif Verildi</option>
							<option value="ACCEPTED">Kabul Edildi</option>
							<option value="REJECTED">Reddedildi</option>
							<option value="COMPLETED">Tamamlandı</option>
						</select>
					</div>
				</div>
			</header>

			<div className="offers-container">
				<div className="offers-list">
					<div className="offers-header">
						<div className="column-header id">#ID</div>
						<div className="column-header date">Tarih</div>
						<div className="column-header customer">Müşteri</div>
						<div className="column-header vehicle">Araç</div>
						<div className="column-header status">Durum</div>
					</div>

					{filteredOffers.length === 0 ? (
						<div className="no-offers">Gösterilecek teklif bulunamadı.</div>
					) : (
						filteredOffers.map((offer) => (
							<div
								key={offer.id}
								className={`offer-item ${selectedOffer?.id === offer.id ? 'selected' : ''}`}
								onClick={() => handleSelectOffer(offer)}
							>
								<div className="offer-id">{offer.id}</div>
								<div className="offer-date">{formatDate(offer.createdAt)}</div>
								<div className="offer-customer">
									<div className="customer-name">{offer.contact.fullName}</div>
									<div className="customer-phone">{offer.contact.phone}</div>
								</div>
								<div className="offer-vehicle">
									<div className="vehicle-brand-model">{offer.brand.name} {offer.model.name}</div>
									<div className="vehicle-details">
										{offer.year.year} • {offer.color.name} • {offer.mileage.toLocaleString('tr-TR')} km
									</div>
								</div>
								<div className="offer-status">
                  <span className={`status-badge ${getStatusClass(offer.status)}`}>
                    {getStatusText(offer.status)}
                  </span>
								</div>
							</div>
						))
					)}
				</div>

				{selectedOffer && (
					<div className="offer-details">
						<div className="details-header">
							<h2>Teklif Detayı #{selectedOffer.id}</h2>
							<button className="close-button" onClick={handleCloseDetails}>×</button>
						</div>

						<div className="details-content">
							<div className="details-section">
								<h3>Araç Bilgileri</h3>
								<div className="details-grid">
									<div className="detail-item">
										<span className="detail-label">Vasıta Tipi:</span>
										<span className="detail-value">{selectedOffer.vehicleType.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Yıl:</span>
										<span className="detail-value">{selectedOffer.year.year}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Marka:</span>
										<span className="detail-value">{selectedOffer.brand.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Model:</span>
										<span className="detail-value">{selectedOffer.model.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Alt Model:</span>
										<span className="detail-value">{selectedOffer.subModel.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Gövde Tipi:</span>
										<span className="detail-value">{selectedOffer.bodyType.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Yakıt Tipi:</span>
										<span className="detail-value">{selectedOffer.fuelType.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Vites Tipi:</span>
										<span className="detail-value">{selectedOffer.transmissionType.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Renk:</span>
										<span className="detail-value">{selectedOffer.color.name}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Kilometre:</span>
										<span className="detail-value">{selectedOffer.mileage.toLocaleString('tr-TR')} km</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Tramer Kaydı:</span>
										<span className="detail-value">
                      {selectedOffer.damageRecord === "NONE"
						  ? "Hasar Kaydı Yok"
						  : selectedOffer.damageAmount
							  ? `Hasar: ${selectedOffer.damageAmount.toLocaleString('tr-TR')} TL`
							  : "Hasar Kaydı Var"}
                    </span>
									</div>
								</div>
							</div>

							<div className="details-section">
								<h3>İletişim Bilgileri</h3>
								<div className="details-grid">
									<div className="detail-item">
										<span className="detail-label">Ad Soyad:</span>
										<span className="detail-value">{selectedOffer.contact.fullName}</span>
									</div>
									<div className="detail-item">
										<span className="detail-label">Telefon:</span>
										<span className="detail-value">{selectedOffer.contact.phone}</span>
									</div>
									{selectedOffer.contact.email && (
										<div className="detail-item">
											<span className="detail-label">E-posta:</span>
											<span className="detail-value">{selectedOffer.contact.email}</span>
										</div>
									)}
								</div>
							</div>

							<div className="details-section">
								<h3>Teklif Durumu</h3>
								<div className="status-update-form">
									<div className="status-current">
										<span className="status-label">Mevcut Durum:</span>
										<span className={`status-badge ${getStatusClass(selectedOffer.status)}`}>
                      {getStatusText(selectedOffer.status)}
                    </span>
									</div>

									<div className="status-actions">
										<div className="form-group">
											<label>Durum:</label>
											<select
												className="status-select"
												value={offerStatus}
												onChange={(e) => setOfferStatus(e.target.value)}
											>
												<option value="PENDING">Beklemede</option>
												<option value="CONTACTED">İletişime Geçildi</option>
												<option value="OFFERED">Teklif Verildi</option>
												<option value="ACCEPTED">Kabul Edildi</option>
												<option value="REJECTED">Reddedildi</option>
												<option value="COMPLETED">Tamamlandı</option>
											</select>
										</div>

										<div className="form-group">
											<label>Teklif Tutarı (TL):</label>
											<input
												type="text"
												value={offerAmount}
												onChange={(e) => setOfferAmount(e.target.value)}
												placeholder="Teklif tutarını girin"
												className="form-input"
											/>
										</div>
									</div>
								</div>
							</div>

							{selectedOffer.notes && (
								<div className="details-section">
									<h3>Müşteri Notları</h3>
									<div className="customer-notes">{selectedOffer.notes}</div>
								</div>
							)}

							{/* Admin Notları */}
							<div className="details-section">
								<h3>Admin Notları</h3>
								<textarea
									className="admin-notes"
									placeholder="Yönetici notları"
									value={adminNotes}
									onChange={(e) => setAdminNotes(e.target.value)}
									rows={5}
								></textarea>

								<div className="update-actions">
									{updateError && <div className="update-error">{updateError}</div>}
									{updateSuccess && <div className="update-success">Teklif başarıyla güncellendi</div>}

									<button
										className={`update-button ${isUpdating ? "loading" : ""}`}
										onClick={handleUpdateOffer}
										disabled={isUpdating}
									>
										{isUpdating ? "Güncelleniyor..." : "Teklifi Güncelle"}
									</button>
								</div>
							</div>

							{selectedOffer.images && selectedOffer.images.length > 0 && (
								<div className="details-section">
									<h3>Araç Fotoğrafları ({selectedOffer.images.length})</h3>
									<div className="image-gallery">
										{selectedOffer.images.map((image, index) => (
											<div key={index} className="gallery-image">
												<img src={image} alt={`Araç fotoğrafı ${index + 1}`} />
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}