using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task01.Model;
using UserApi.Services;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardsController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpPost("get")]
        public ActionResult<IEnumerable<UserCard>> GetAllCards([FromBody] CardInfo info)
        {
            if (info == null || info.UserId== 0)
                return BadRequest("Invalid or missing Card Informationu");

            var userCards = _cardService.GetAllCards(info.UserId);

            if (!userCards.Any())
                return NotFound("No cards found for this user.");

            return Ok(userCards);
        }

        [HttpPost("add")]
        public ActionResult<UserCard> AddCard([FromBody] UserCard userCard)
        {
            if (userCard == null || userCard.UserId == 0 || string.IsNullOrWhiteSpace(userCard.CardNumber))
                return BadRequest("Invalid card data.");

            var createdCard = _cardService.AddCard(userCard);
            return CreatedAtAction(nameof(GetAllCards), new { userId = createdCard.UserId }, createdCard);
        }

        [HttpPost("setDefault")]
        public IActionResult SetDefaultCard([FromBody] CardInfo info)
        {
            if (info.UserId == 0 || info.CardId == 0)
                return BadRequest("Invalid or Missing Parameters");

            _cardService.SetDefaultCard(info.UserId, info.CardId);
            return Ok("Card display preference updated successfully.");
        }
    }
}
