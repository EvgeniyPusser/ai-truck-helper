// System for ratings and reviews for Holy Move providers

export class RatingCalculator {
  // Calculate overall provider rating
  static calculateOverallRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        overall: 0,
        communication: 0,
        timeliness: 0,
        professionalism: 0,
        price_fairness: 0,
        total_reviews: 0
      };
    }

    const validReviews = reviews.filter(review => review.verified_purchase);
    
    if (validReviews.length === 0) {
      return {
        overall: 0,
        communication: 0,
        timeliness: 0,
        professionalism: 0,
        price_fairness: 0,
        total_reviews: 0
      };
    }

    const weights = {
      overall: 0.4,
      communication: 0.2,
      timeliness: 0.2,
      professionalism: 0.15,
      price_fairness: 0.05
    };

    const averages = {
      overall: this.calculateAverage(validReviews, 'rating'),
      communication: this.calculateAverage(validReviews, 'communication_quality'),
      timeliness: this.calculateAverage(validReviews, 'timeliness'),
      professionalism: this.calculateAverage(validReviews, 'professionalism'),
      price_fairness: this.calculateAverage(validReviews, 'price_fairness')
    };

    const weightedScore = 
      averages.overall * weights.overall +
      averages.communication * weights.communication +
      averages.timeliness * weights.timeliness +
      averages.professionalism * weights.professionalism +
      averages.price_fairness * weights.price_fairness;

    return {
      overall: Math.round(weightedScore * 100) / 100,
      communication: averages.communication,
      timeliness: averages.timeliness,
      professionalism: averages.professionalism,
      price_fairness: averages.price_fairness,
      total_reviews: validReviews.length
    };
  }

  // Calculate average value
  static calculateAverage(items, field) {
    const validItems = items.filter(item => item[field] && item[field] >= 1 && item[field] <= 5);
    if (validItems.length === 0) return 0;
    
    const sum = validItems.reduce((acc, item) => acc + item[field], 0);
    return Math.round((sum / validItems.length) * 100) / 100;
  }

  // Calculate reliability score
  static calculateReliabilityScore(providerData) {
    const factors = {
      completion_rate: providerData.completion_rate || 0,
      on_time_rate: providerData.on_time_rate || 0,
      damage_rate: Math.max(0, 100 - (providerData.damage_rate || 0)),
      dispute_resolution_rate: providerData.dispute_resolution_rate || 0,
      customer_satisfaction: providerData.customer_satisfaction_score || 0
    };

    const weights = {
      completion_rate: 0.3,
      on_time_rate: 0.25,
      damage_rate: 0.2,
      dispute_resolution_rate: 0.15,
      customer_satisfaction: 0.1
    };

    const score = 
      factors.completion_rate * weights.completion_rate +
      factors.on_time_rate * weights.on_time_rate +
      factors.damage_rate * weights.damage_rate +
      factors.dispute_resolution_rate * weights.dispute_resolution_rate +
      factors.customer_satisfaction * weights.customer_satisfaction;

    return Math.round(score * 100) / 100;
  }

  // Calculate professionalism score
  static calculateProfessionalismScore(providerData) {
    const factors = {
      years_in_business: Math.min(providerData.years_in_business || 0, 20) / 20,
      verification_status: providerData.is_verified ? 1 : 0,
      insurance_coverage: providerData.insurance_info ? 1 : 0,
      license_valid: providerData.license_number ? 1 : 0,
      response_time: Math.max(0, 1 - (providerData.response_time_avg || 0) / 1440)
    };

    const weights = {
      years_in_business: 0.2,
      verification_status: 0.25,
      insurance_coverage: 0.2,
      license_valid: 0.2,
      response_time: 0.15
    };

    const score = 
      factors.years_in_business * weights.years_in_business +
      factors.verification_status * weights.verification_status +
      factors.insurance_coverage * weights.insurance_coverage +
      factors.license_valid * weights.license_valid +
      factors.response_time * weights.response_time;

    return Math.round(score * 100) / 100;
  }

  // Get trust level
  static getTrustLevel(rating, reliability, professionalism) {
    const overallScore = (rating * 0.4 + reliability * 0.3 + professionalism * 0.3);
    
    if (overallScore >= 4.5) return 'EXCELLENT';
    if (overallScore >= 4.0) return 'VERY_GOOD';
    if (overallScore >= 3.5) return 'GOOD';
    if (overallScore >= 3.0) return 'FAIR';
    if (overallScore >= 2.0) return 'POOR';
    return 'VERY_POOR';
  }
}

export class ReviewManager {
  // Validate review
  static validateReview(reviewData) {
    const errors = [];

    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!reviewData.move_request_id) {
      errors.push('Move request ID is required');
    }

    if (!reviewData.provider_id) {
      errors.push('Provider ID is required');
    }

    if (!reviewData.customer_id) {
      errors.push('Customer ID is required');
    }

    // Validate sub-ratings
    const subRatings = ['communication_quality', 'timeliness', 'professionalism', 'price_fairness'];
    subRatings.forEach(field => {
      if (reviewData[field] && (reviewData[field] < 1 || reviewData[field] > 5)) {
        errors.push(`${field} must be between 1 and 5`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check for duplicate reviews
  static checkDuplicateReview(existingReviews, newReview) {
    return existingReviews.some(review => 
      review.move_request_id === newReview.move_request_id &&
      review.customer_id === newReview.customer_id
    );
  }

  // Filter reviews
  static filterReviews(reviews, filters = {}) {
    let filtered = [...reviews];

    if (filters.minRating) {
      filtered = filtered.filter(review => review.rating >= filters.minRating);
    }

    if (filters.maxRating) {
      filtered = filtered.filter(review => review.rating <= filters.maxRating);
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(review => review.verified_purchase);
    }

    if (filters.withPhotos) {
      filtered = filtered.filter(review => review.photos && review.photos.length > 0);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(review => new Date(review.created_at) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(review => new Date(review.created_at) <= new Date(filters.dateTo));
    }

    return filtered;
  }

  // Sort reviews
  static sortReviews(reviews, sortBy = 'created_at', order = 'desc') {
    const sorted = [...reviews];
    
    sorted.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'created_at') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (order === 'desc') {
        return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

    return sorted;
  }

  // Generate review summary
  static generateReviewSummary(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        total: 0,
        average_rating: 0,
        rating_distribution: {},
        common_pros: [],
        common_cons: [],
        recommendation_rate: 0
      };
    }

    const validReviews = reviews.filter(review => review.verified_purchase);
    const total = validReviews.length;

    // Rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;
    let recommendations = 0;

    validReviews.forEach(review => {
      distribution[review.rating]++;
      totalRating += review.rating;
      if (review.would_recommend) recommendations++;
    });

    // Analyze common pros and cons
    const prosCount = {};
    const consCount = {};

    validReviews.forEach(review => {
      if (review.pros) {
        review.pros.forEach(pro => {
          prosCount[pro] = (prosCount[pro] || 0) + 1;
        });
      }
      if (review.cons) {
        review.cons.forEach(con => {
          consCount[con] = (consCount[con] || 0) + 1;
        });
      }
    });

    const commonPros = Object.entries(prosCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pro]) => pro);

    const commonCons = Object.entries(consCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([con]) => con);

    return {
      total,
      average_rating: Math.round((totalRating / total) * 100) / 100,
      rating_distribution: distribution,
      common_pros: commonPros,
      common_cons: commonCons,
      recommendation_rate: Math.round((recommendations / total) * 100)
    };
  }
}

export class ReviewModeration {
  // Check review for spam/inappropriate content
  static moderateReview(reviewContent) {
    const issues = [];
    const flags = [];

    // Check length
    if (reviewContent.comment && reviewContent.comment.length < 10) {
      issues.push('Comment too short');
      flags.push('SHORT_COMMENT');
    }

    if (reviewContent.comment && reviewContent.comment.length > 2000) {
      issues.push('Comment too long');
      flags.push('LONG_COMMENT');
    }

    // Check for forbidden words (basic implementation)
    const forbiddenWords = ['spam', 'fake', 'scam', 'fraud'];
    const comment = (reviewContent.comment || '').toLowerCase();
    
    forbiddenWords.forEach(word => {
      if (comment.includes(word)) {
        issues.push(`Contains forbidden word: ${word}`);
        flags.push('FORBIDDEN_CONTENT');
      }
    });

    // Check for excessive caps
    if (reviewContent.comment && reviewContent.comment === reviewContent.comment.toUpperCase() && reviewContent.comment.length > 20) {
      issues.push('Excessive capitalization');
      flags.push('EXCESSIVE_CAPS');
    }

    // Check for repeating characters
    if (reviewContent.comment && /(.)\1{4,}/.test(reviewContent.comment)) {
      issues.push('Repeating characters');
      flags.push('REPEATING_CHARS');
    }

    return {
      isApproved: issues.length === 0,
      issues,
      flags,
      requiresManualReview: issues.length > 0
    };
  }

  // Auto approve or reject
  static autoModerateReview(reviewContent) {
    const moderation = this.moderateReview(reviewContent);
    
    if (moderation.isApproved) {
      return {
        status: 'APPROVED',
        ...moderation
      };
    }

    // If only formatting issues, auto-approve
    const formattingIssues = ['SHORT_COMMENT', 'LONG_COMMENT', 'EXCESSIVE_CAPS', 'REPEATING_CHARS'];
    const hasOnlyFormattingIssues = moderation.flags.every(flag => formattingIssues.includes(flag));

    if (hasOnlyFormattingIssues) {
      return {
        status: 'APPROVED_WITH_WARNING',
        ...moderation
      };
    }

    return {
      status: 'PENDING_REVIEW',
      ...moderation
    };
  }
}

export class RatingAnalytics {
  // Analytics for provider ratings
  static getProviderRatingAnalytics(reviews, timeRange = '12m') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '12m':
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    const filteredReviews = reviews.filter(review => 
      new Date(review.created_at) >= startDate
    );

    const monthlyData = {};
    
    filteredReviews.forEach(review => {
      const month = new Date(review.created_at).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          count: 0,
          total_rating: 0,
          average_rating: 0
        };
      }
      
      monthlyData[month].count++;
      monthlyData[month].total_rating += review.rating;
      monthlyData[month].average_rating = monthlyData[month].total_rating / monthlyData[month].count;
    });

    return {
      timeRange,
      total_reviews: filteredReviews.length,
      average_rating: RatingCalculator.calculateAverage(filteredReviews, 'rating'),
      monthly_trend: monthlyData
    };
  }

  // Compare with competitors
  static compareWithCompetitors(providerReviews, competitorReviews) {
    const providerStats = RatingCalculator.calculateOverallRating(providerReviews);
    const competitorStats = competitorReviews.map(reviews => 
      RatingCalculator.calculateOverallRating(reviews)
    );

    const avgCompetitorRating = competitorStats.reduce((sum, stat) => sum + stat.overall, 0) / competitorStats.length;
    const rank = competitorStats.filter(stat => stat.overall > providerStats.overall).length + 1;

    return {
      provider_rating: providerStats.overall,
      competitor_average: Math.round(avgCompetitorRating * 100) / 100,
      rank_out_of: competitorStats.length + 1,
      percentile: Math.round(((competitorStats.length + 1 - rank) / (competitorStats.length + 1)) * 100)
    };
  }
}

export default {
  RatingCalculator,
  ReviewManager,
  ReviewModeration,
  RatingAnalytics
};
