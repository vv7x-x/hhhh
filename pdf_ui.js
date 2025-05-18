document.getElementById('generateBtn').addEventListener('click', async () => {
  const description = document.getElementById('description').value.trim();
  const statusElement = document.getElementById('status');
  
  if (!description) {
    statusElement.textContent = 'الرجاء إدخال وصف للبحث عنه';
    statusElement.className = 'status error';
    statusElement.style.display = 'block';
    return;
  }
  
  try {
    statusElement.textContent = 'جاري البحث وإنشاء ملف PDF...';
    statusElement.className = 'status';
    statusElement.style.display = 'block';
    
    const { generatePDFFromDescription } = await import('./pdf_generator.js');
    const result = await generatePDFFromDescription(description);
    
    if (result.success) {
      statusElement.textContent = `تم إنشاء الملف بنجاح: ${result.filePath}`;
      statusElement.className = 'status success';
    } else {
      statusElement.textContent = `حدث خطأ: ${result.error}`;
      statusElement.className = 'status error';
    }
  } catch (error) {
    statusElement.textContent = `حدث خطأ: ${error.message}`;
    statusElement.className = 'status error';
    console.error(error);
  }
});