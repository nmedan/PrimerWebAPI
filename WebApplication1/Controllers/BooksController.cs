using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PripremaTest1.Interfaces;
using PripremaTest1.Repository;
using PripremaTest1.Models;
using System.Web.Http.Description;
using System.Data.Entity;
using System.Web.Http.Tracing;
using System.Data.Entity.Infrastructure;
namespace PripremaTest1.Controllers
{
    public class BooksController : ApiController
    {
        IBookRepo _repository { get; set; }

        public BooksController(IBookRepo repository)
        {
            _repository = repository;
        }


        public IEnumerable<Book> Get()
        {
            return _repository.GetAll();
        }

        [Authorize]
        public IEnumerable<Book> GetByAuthor(int authorId)
        {
            return _repository.GetByAuthor(authorId);
        }

        [Authorize]
        public IHttpActionResult Get(int id)
        {
            var book = _repository.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }


        [Authorize]
        public IHttpActionResult Post(Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repository.Add(book);
            return CreatedAtRoute("DefaultApi", new { id = book.Id }, book);
        }



        [ResponseType(typeof(Book))]
        [Authorize]
        public IHttpActionResult Put(int id, Book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.Id)
            {
                return BadRequest();
            }

            try
            {

                _repository.Edit(book);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_repository.BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(book);
        }

        [Authorize]
        public IHttpActionResult Delete(int id)
        {
            var book = _repository.GetById(id);
            if (book == null)
            {
                return NotFound();
            }

            _repository.Delete(book);
            return Ok(book);
        }
    }
}
