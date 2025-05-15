import React, {useState, useRef, ChangeEvent, useEffect} from "react";
import {useStepperContext} from "../StepperContext";

import "../styles/StepperContainer.css";

export function VehicleDetailsForm() {
	const {selections, updateSelection} = useStepperContext();
	const [notes, setNotes] = useState<string>(selections.notes || "");
	const [images, setImages] = useState<string[]>(selections.images || []);
	const [uploading, setUploading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Not değiştiğinde context'e kaydet
	useEffect(() => {
		updateSelection("notes", notes);
	}, [notes]);

	// Resimler değiştiğinde context'e kaydet
	useEffect(() => {
		updateSelection("images", images);
	}, [images]);

	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNotes(e.target.value);
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		if (images.length + files.length > 10) {
			setError("En fazla 10 fotoğraf yükleyebilirsiniz.");
			return;
		}

		setUploading(true);
		setError(null);

		try {
			// Bu kısımda normalde bir dosya yükleme servisi kullanılır
			// Ancak şu an için dosyaları base64 olarak dönüştürüp saklıyoruz
			const newImages = [...images];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				if (file.size > 5 * 1024 * 1024) { // 5MB
					setError("Dosya boyutu 5MB'tan büyük olamaz.");
					continue;
				}

				if (!file.type.startsWith("image/")) {
					setError("Sadece resim dosyaları yükleyebilirsiniz.");
					continue;
				}

				const reader = new FileReader();

				const imageDataUrl = await new Promise<string>((resolve) => {
					reader.onload = (e) => resolve(e.target?.result as string);
					reader.readAsDataURL(file);
				});

				newImages.push(imageDataUrl);
			}

			setImages(newImages);

			// Dosya input'unu temizle
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			setError("Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
			console.error("Dosya yükleme hatası:", error);
		} finally {
			setUploading(false);
		}
	};

	const removeImage = (index: number) => {
		setImages(prev => prev.filter((_, i) => i !== index));
	};

	if (!selections.contact) {
		return <div className="message">Lütfen önce iletişim bilgilerinizi tamamlayın.</div>;
	}

	return (
		<div className="form-container" id="vehicleDetailsForm">
			<h2 className="form-title">Ek Bilgiler</h2>
			<p className="form-subtitle">Aracınız hakkında eklemek istediğiniz bilgiler ve fotoğraflar</p>

			<div className="form-group">
				<label htmlFor="notes" className="form-label">Notlar</label>
				<textarea
					id="notes"
					className="form-textarea"
					value={notes}
					onChange={handleNotesChange}
					placeholder="Aracınız hakkında eklemek istediğiniz bilgileri yazabilirsiniz..."
					rows={5}
				/>
			</div>

			<div className="form-group">
				<label className="form-label">Fotoğraflar</label>
				<p className="form-hint">En fazla 10 adet fotoğraf yükleyebilirsiniz. (Maksimum dosya boyutu: 5MB)</p>

				<div className="file-upload">
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleFileChange}
						ref={fileInputRef}
						disabled={uploading}
						className="file-input"
						id="imageUpload"
					/>
					<label htmlFor="imageUpload" className="file-label">
						{uploading ? "Yükleniyor..." : "Fotoğraf Seç"}
					</label>
				</div>

				{error && <div className="form-error">{error}</div>}

				{images.length > 0 && (
					<div className="image-preview-container">
						{images.map((image, index) => (
							<div key={index} className="image-preview">
								<img src={image} alt={`Yüklenen resim ${index + 1}`}/>
								<button
									type="button"
									className="image-remove-btn"
									onClick={() => removeImage(index)}
									aria-label="Resmi kaldır"
								>
									&#10005;
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}