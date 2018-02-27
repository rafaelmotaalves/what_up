var moment = require('moment');
/* compares posts relevance taking into consideration the time since the post has
 been created and its score */

function comparePostsRelevance(postA, postB){

	var unixTimeSinceCreatedA = moment().unix() - moment(postA.createdAt).unix();
	var scoreA = postA.upvotes.length - postA.downvotes.length + 1;
	var unixTimeSinceCreatedB = moment().unix() - moment(postB.createdAt).unix();
	var scoreB = postB.upvotes.length - postB.downvotes.length + 1;

	var relevanceA = ((8640 * scoreA)/ unixTimeSinceCreatedA);
	var relevanceB = ((8640 * scoreB)/ unixTimeSinceCreatedB);

	if(relevanceA > relevanceB){
		return -1;
	}else if(relevanceA < relevanceB){
		return +1;
	}
	return 0;
}


module.exports = comparePostsRelevance;