"use client";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  MapPin, 
  FileText, 
  Tag, 
  Image as ImageIcon,
  Send,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const IssueForm = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const fileInputRef = useRef(null);
  const ip=useRef(null);

  const categories = [
    { value: 'electrical', label: 'Electrical', color: 'from-yellow-500 to-orange-500' },
    { value: 'water', label: 'Water Supply', color: 'from-blue-500 to-cyan-500' },
    { value: 'cleaniness', label: 'Cleanliness', color: 'from-green-500 to-emerald-500' },
    { value: 'transportation', label: 'Transportation & Road Safety', color: 'from-red-500 to-pink-500' },
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData(e.target);

      const res = await fetch("/api/issues", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          router.refresh();
          router.replace("/issue");
        }, 1500);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };
    const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        ip.current.value="Latitute : "+latitude+" Longitude :"+longitude;
      },
      () => {
        alert("Unable to fetch location");
      }
    )
  }
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #030712 50%, #111827 100%)',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10rem',
          right: '-10rem',
          width: '20rem',
          height: '20rem',
          backgroundColor: '#a855f7',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(48px)',
          opacity: 0.1,
          animation: 'pulse 2s infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(48px)',
          opacity: 0.1,
          animation: 'pulse 2s infinite',
          animationDelay: '1s'
        }} />
      </div>

      <div style={{
        position: 'relative',
        maxWidth: '42rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Report an Issue
          </h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '1.125rem',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            Help improve your community by reporting issues. Your voice matters.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.4)',
            backdropFilter: 'blur(24px)',
            borderRadius: '1rem',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
        >
          {/* Form Header */}
          <div style={{
            borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))',
                borderRadius: '0.5rem'
              }}>
                <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#60a5fa' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  Issue Details
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af'
                }}>
                  Fill in the details below
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Title Field */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d1d5db'
              }}>
                <div style={{
                  padding: '0.375rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.25rem'
                }}>
                  <FileText style={{ width: '1rem', height: '1rem', color: '#60a5fa' }} />
                </div>
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid #374151',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  color: 'white',
                  transition: 'all 0.3s'
                }}
                className="focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 hover:border-gray-600"
                placeholder="Enter a descriptive title"
              />
            </motion.div>

            {/* Description Field */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d1d5db'
              }}>
                <div style={{
                  padding: '0.375rem',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '0.25rem'
                }}>
                  <FileText style={{ width: '1rem', height: '1rem', color: '#c084fc' }} />
                </div>
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid #374151',
                  borderRadius: '0.75rem',
                  outline: 'none',
                  color: 'white',
                  resize: 'none',
                  transition: 'all 0.3s'
                }}
                className="focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 hover:border-gray-600"
                placeholder="Describe the issue in detail..."
              />
            </motion.div>

            {/* Location Field */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d1d5db'
              }}>
                <div style={{
                  padding: '0.375rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '0.25rem'
                }}>
                  <MapPin style={{ width: '1rem', height: '1rem', color: '#34d399' }} />
                </div>
                <span>
                Location   /     
                </span>
                <span className='cursor-pointer' onClick={getCurrentLocation}>
                  Get current location
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="location"
                  ref={ip}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(17, 24, 39, 0.6)',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    outline: 'none',
                    color: 'white',
                    transition: 'all 0.3s'
                  }}
                  className="focus:border-green-500 focus:shadow-lg focus:shadow-green-500/20 hover:border-gray-600"
                  placeholder="Where exactly is this issue?"
                />
                <div style={{
                  position: 'absolute',
                  inset: '0 0.75rem 0 auto',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <MapPin style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                </div>
              </div>
            </motion.div>

            {/* Category Field */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#d1d5db'
                }}>
                  <div style={{
                    padding: '0.375rem',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    borderRadius: '0.25rem'
                  }}>
                    <Tag style={{ width: '1rem', height: '1rem', color: '#fbbf24' }} />
                  </div>
                  Category
                </label>
                
                {/* Category Dropdown */}
                <div style={{ position: 'relative' }}>
                  <select
                    name="category"
                    required
                    defaultValue="electrical"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(17, 24, 39, 0.6)',
                      border: '1px solid #374151',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      appearance: 'none',
                      transition: 'all 0.3s'
                    }}
                    className="focus:border-yellow-500 focus:shadow-lg focus:shadow-yellow-500/20 hover:border-gray-600"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} style={{ backgroundColor: '#1f2937' }}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    inset: '0 0.75rem 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* File Upload */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#d1d5db'
              }}>
                <div style={{
                  padding: '0.375rem',
                  backgroundColor: 'rgba(236, 72, 153, 0.1)',
                  borderRadius: '0.25rem'
                }}>
                  <ImageIcon style={{ width: '1rem', height: '1rem', color: '#f472b6' }} />
                </div>
                Images (Multiple)
              </label>
              
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  position: 'relative',
                  border: '2px dashed',
                  borderColor: selectedFiles.length > 0 ? '#ec4899' : '#374151',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundColor: selectedFiles.length > 0 ? 'rgba(236, 72, 153, 0.05)' : 'rgba(17, 24, 39, 0.3)',
                  transition: 'all 0.3s'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  name="images"
                />
                
                <motion.div
                  animate={selectedFiles.length > 0 ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Upload style={{
                    width: '3rem',
                    height: '3rem',
                    margin: '0 auto 1rem auto',
                    color: selectedFiles.length > 0 ? '#f472b6' : '#6b7280'
                  }} />
                </motion.div>
                
                <p style={{
                  color: '#d1d5db',
                  fontWeight: 500,
                  marginBottom: '0.5rem'
                }}>
                  {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drop files here or click to upload'}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Supports JPG, PNG, GIF • Max 10MB each
                </p>
                
                {selectedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '1.5rem' }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem'
                    }}>
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            position: 'relative',
                            backgroundColor: 'rgba(31, 41, 55, 0.5)',
                            borderRadius: '0.5rem',
                            padding: '0.75rem'
                          }}
                          className="group"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ImageIcon style={{ width: '1rem', height: '1rem', color: '#60a5fa', flexShrink: 0 }} />
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#d1d5db',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-0.5rem',
                              right: '-0.5rem',
                              padding: '0.25rem',
                              backgroundColor: '#ef4444',
                              borderRadius: '9999px',
                              color: 'white',
                              opacity: 0,
                              transition: 'opacity 0.2s'
                            }}
                            className="group-hover:opacity-100"
                          >
                            <X style={{ width: '0.75rem', height: '0.75rem' }} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(21, 128, 61, 0.3)',
                  border: '1px solid rgba(21, 128, 61, 0.5)',
                  borderRadius: '0.75rem'
                }}
              >
                <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#34d399' }} />
                <div>
                  <p style={{
                    fontWeight: 500,
                    color: '#86efac'
                  }}>
                    Report submitted successfully!
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(134, 239, 172, 0.7)'
                  }}>
                    Redirecting...
                  </p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(153, 27, 27, 0.3)',
                  border: '1px solid rgba(153, 27, 27, 0.5)',
                  borderRadius: '0.75rem'
                }}
              >
                <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#f87171' }} />
                <div>
                  <p style={{
                    fontWeight: 500,
                    color: '#fca5a5'
                  }}>
                    Submission failed!
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'rgba(252, 165, 165, 0.7)'
                  }}>
                    Please try again.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ paddingTop: '1.5rem' }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isSubmitting 
                    ? '#374151' 
                    : 'linear-gradient(to right, #2563eb, #7c3aed, #db2777)',
                  color: 'white',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
                className="hover:shadow-2xl hover:shadow-purple-500/30"
              >
                {/* Animated background */}
                {isSubmitting && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, #3b82f6, #a855f7, #ec4899)'
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%'
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send style={{ width: '1.5rem', height: '1.5rem' }} />
                      Submit Report
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </form>

          {/* Form Footer */}
          <div style={{
            borderTop: '1px solid rgba(55, 65, 81, 0.5)',
            padding: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              By submitting this form, you agree to our{' '}
              <a href="#" style={{
                color: '#60a5fa',
                transition: 'color 0.2s'
              }} className="hover:text-blue-300">
                terms of service
              </a>
              {' '}and{' '}
              <a href="#" style={{
                color: '#60a5fa',
                transition: 'color 0.2s'
              }} className="hover:text-blue-300">
                privacy policy
              </a>
              .
            </p>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          {['🔧', '💧', '🧹', '🚧'].map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              style={{
                fontSize: '1.5rem',
                opacity: 0.5,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              className="hover:opacity-100"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        .focus\\:border-blue-500:focus {
          border-color: #3b82f6;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
        }
        
        .focus\\:border-purple-500:focus {
          border-color: #a855f7;
          box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.2);
        }
        
        .focus\\:border-green-500:focus {
          border-color: #10b981;
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
        }
        
        .focus\\:border-yellow-500:focus {
          border-color: #eab308;
          box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.2);
        }
        
        .hover\\:border-gray-600:hover {
          border-color: #4b5563;
        }
        
        .hover\\:shadow-2xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .hover\\:shadow-purple-500\\/30:hover {
          box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.3);
        }
        
        .hover\\:opacity-100:hover {
          opacity: 1;
        }
        
        .hover\\:text-blue-300:hover {
          color: #93c5fd;
        }
        
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default IssueForm;