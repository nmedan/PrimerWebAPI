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
using System.Web.Http.Tracing;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;

namespace PripremaTest1.Controllers
{
    public class AuthorsController : ApiController
    {
        IAuthorRepo _repository { get; set; }

        public AuthorsController(IAuthorRepo repository)
        {
            _repository = repository;
        }


        public IEnumerable<Author> Get()
        {
            return _repository.GetAll();
        }

        public IHttpActionResult Get(int id)
        {
            var author = _repository.GetById(id);
            if (author == null)
            {
                return NotFound();
            }
            return Ok(author);
        }



        public IHttpActionResult Post(Author author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repository.Add(author);
            return CreatedAtRoute("DefaultApi", new { id = author.Id }, author);
        }



        [ResponseType(typeof(Author))]
        public IHttpActionResult Put(int id, Author author)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != author.Id)
            {
                return BadRequest();
            }

            try
            {

                _repository.Edit(author);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_repository.AuthorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(author);
        }

        public IHttpActionResult Delete(int id)
        {
            var author = _repository.GetById(id);
            if (author == null)
            {
                return NotFound();
            }

            _repository.Delete(author);
            return Ok(author);
        }
    }
}
